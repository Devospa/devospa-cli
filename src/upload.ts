import * as rimraf from 'rimraf'
import * as FormData from 'form-data'
import * as fs from 'fs'
import * as cliProgress from 'cli-progress'
import { zip } from 'zip-a-folder'
import { readStoredData } from './store'
import { handleError } from './errors'
import { fileUpload } from './api'
const concat = require('concat-stream')
const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

export async function upload(buildFolder) {
  const { userToken, tags, projectToken } = readStoredData()
  // Compresses the build folder
  if (!userToken || !projectToken) {
    return handleError('upload unable to access userToken')
  }
  const tagSp = tags.replace('#', '-')
  const zipFileName = "./" + tagSp + projectToken + ".zip"
  await zip(buildFolder, zipFileName)

  // Creates a FormData and merge the zip file into it
  const fd = new FormData()
  fd.append("token", projectToken)
  fd.append("tags", tags)
  fd.append("userToken", userToken)
  fd.append("file", fs.createReadStream(zipFileName))

  const cs: any = concat({ encoding: "buffer" }, (data: any) => {
    if (!data) {
      return handleError("Errored at buffering")
    }
    progressBar.start(100, 1)
    return fileUpload(data, fd.getHeaders(), ({ percent }) => {
      progressBar.update(Math.round(percent * 100))
    }).then((uploadResponse) => {
      progressBar.stop()
      console.log("Upload completed, Please check devospa.com")
    }).catch(e => {
      progressBar.stop()
      return handleError("Sorry but uploading the zip file errored, Please try again in a few second")
    }).finally(() => {
      // Removes the zip file
      rimraf(zipFileName, (e) => {
        e && console.log(e)
        console.log("Removed created zip file")
        process.exit()
      })
    })
  })
  fd.pipe(cs)
}