export default function serverJsonFieldReplace (str: string) {
  return str
    .replace(/\"/g, '\\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}
