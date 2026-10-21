export function extractMail(str: string) {
  const emailReg = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  return str.match(emailReg)?.[0]
}
