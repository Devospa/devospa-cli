#!/usr/bin/env node

import * as program from 'commander'
const ourPackage = require('../package.json')
import { upload } from './upload'
import { prepare } from './prepare'
import { login, checkAndAuthenticate } from './login'

program
  .version(ourPackage.version, "-v, --version")

program
  .command("login")
  .action(async (options, command) => {
    login()
  })

program
  .command("prepare")
  .arguments("<token>")
  .description("prepare command", {
    token: "The given project token in devospa.com",
  })
  .action(async (projectToken, options, command) => {
    const userToken = await checkAndAuthenticate()
    await prepare(projectToken, userToken)
  })

program
  .command("upload")
  .arguments("<buildFolder>")
  .description("push command", {
    buildFolder: "build folder"
  })
  .action(async (buildFolder, options, command) => {
    await upload(buildFolder)
  })

program
  .command("push")
  .arguments("<token>")
  .arguments("<buildFolder>")
  .description("push command", {
    token: "The given project token in devospa.com",
    buildFolder: "build folder"
  })
  .action(async (token, buildFolder, options, command) => {
    console.log(`${buildFolder} folder will be zipped and uploaded to devospa.com`)
    const userToken = await checkAndAuthenticate()
    await prepare(token, userToken)
    await upload(buildFolder)
  })
  
program.parseAsync(process.argv)
