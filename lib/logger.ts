class Logger {
  constructor() {}
  
  log(statement: string) {
    const timestamp = new Date().getTime();
    const log = timestamp + ": " + statement;
    console.log(log);
  }
}

export default Logger;
