
export const buildBroadcastCommand = (host: string, port: number, command: string, useEmptyStdOut?: boolean, useEmptyStdErr?: boolean) => {
  const stdOut = `\\\"stdout\\\":\\\"${useEmptyStdOut ? `{}` : `" + __stdout + "`}\\\"`;
  const stdErr = `\\\"stdout\\\":\\\"${useEmptyStdErr ? `{}` : `" + __stdout + "`}\\\"`;
  return `adobe-broadcast --host=${host} --port=${port} --msg='{\\\"command\\\":\\\"${command}\\\",${stdOut}, ${stdErr}}'`;
}
