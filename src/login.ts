import * as poss from 'poss'
import * as inquirer from 'inquirer'

import { readStoredData, storeData } from './store'
import { handleError } from './errors'
import { signIn } from './api'

export async function login() {
  const getUsername = { name: "email", message:"Email", description: "Enter your email address to login"}
  const getPassword = { name: "password", message: "Password",  description: "Enter the password you would login to devospa"}
  const [blErr, loginData] = await poss(inquirer.prompt([getUsername, getPassword]))
  if (blErr) { return handleError("Problem in getting user data") }
  const { email, password } = loginData
  const { userToken } = await signIn(email, password)
  if (!userToken) { return handleError("Email or password is wrong, please use the email you registered with in devospa.com") }
  storeData({ userToken })
  return userToken
}

export async function checkAndAuthenticate() {
  let { userToken } = readStoredData()
  if (!userToken) {
    userToken = await login()
  }
  return userToken
}