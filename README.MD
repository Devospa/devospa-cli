# Devospa Cli
A cli to upload the build folder to [Devospa.com](http://devospa.com).

Devospa lets frontend developers easily demo the changes they have made on a SPA project even if its not completed.

## How to use the cli
You can use it via `npx` as the following command without installation
```
npx devospa push given_token_in_devospa.com buildFolderPath
```
or install it globally
```
npm i -g devospa
npm run build
devospa push given_token_in_devospa.com build
```

If you want to be asked before build process you can use the following commands
```
devospa prepare given_token_in_devospa.com
npm run build
devospa upload build
```

## Getting Started with Devospa
Go to [Devospa.com](http://devospa.com) and click on the start button.