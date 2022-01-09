export function handleError(message) {
  console.log(message)
  // put them into sentry
  process.exit(7)
}