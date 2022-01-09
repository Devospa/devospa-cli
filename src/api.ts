import got from 'got'

import { baseURL } from './consts'
import { handleError } from './errors'

const ApiUrl = `${baseURL}/devospaApi`

function post(url, json) {
  return got.post(ApiUrl + url, { json }).json().catch(err => {
    if (err.code === 'ECONNREFUSED') {
      handleError("Devospa is out of service, please try again")
    }
    if (err.response.statusCode === 503) {
      handleError("Please login again using the folowing command, npx devospa login")
    }
    throw err
  })
}

export function checkProject(userToken, projectToken) {
  console.log(userToken, projectToken)
  return post('/checkProjectToken', { projectToken, userToken }).catch(err => {
    console.log(err.response.body)
    handleError("The project token is wrong, please copy the command from devospa.com")
  })
}

export function signIn(email, password): Promise<any> {
  return post('/loginUser', { email, password }).then(v => v).catch((err) => {
    handleError("Email or password is wrong, please use the email you registered with in devospa.com")
  })
}


export function fileUpload(body, headers, onProgress) {
  return got
    .post(ApiUrl + '/upload', { body, headers })
    .on("uploadProgress", onProgress)
}
