import * as fs from 'fs'
import * as path from 'path'

export function getStoreFilePath() {
  const appDir = path.dirname(require.main.filename);
  return path.join(appDir, "/stores.json")
}
export function readStoredData() {
  try {
    return require(getStoreFilePath())
  } catch(e) {
    return {}
  }
}
export function storeData(json) {
  fs.writeFile(getStoreFilePath(), JSON.stringify(json), (err) => {})
}