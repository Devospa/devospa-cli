
import * as poss from 'poss'
import * as inquirer from 'inquirer'
import { storeData } from './store'
import { handleError } from './errors'
import { checkProject } from './api'
import { execSync } from 'child_process'

export async function prepare(projectToken, userToken) {
  // Checks the project token
  await checkProject(userToken, projectToken)

  // Gets tags
  const commandOutput = execSync('git rev-parse --abbrev-ref HEAD')
  const defaultBranchName = commandOutput.toString().trim()
  
  const getTags = { name: "tags", 
  transformer: function (a, b) {
    return `#${defaultBranchName} ${a}`
  },
  message: "Tags",  description: "Team members could find or filter demo items by these entered tags"}
  const [bErr, tagsRes] = await poss(inquirer.prompt([getTags]))
  if (bErr) {
    return handleError("Getting tags encountred with error")
  }
  const { tags } = tagsRes
  const plusBranchTag = `#${defaultBranchName} ${tags}`
  storeData({ userToken, tags: plusBranchTag, projectToken })
}