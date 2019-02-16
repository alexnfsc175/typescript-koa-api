import { createWriteStream, existsSync, closeSync, openSync } from "fs";
import { resolve } from "path";

export default class Log {
  private static log_path = "../logs";
  private static readonly DEBUG = "debug";
  private static readonly INFO = "info";
  private static readonly NOTICE = "notice";
  private static readonly WARNING = "warning";
  private static readonly ERROR = "error";
  private static readonly CRITICAL = "critical";
  private static readonly ALERT = "alert";
  private static readonly EMERGENCY = "emergency";

  constructor(parameters) {}

  private static writeLog(level: string, message: string) {
    this.fireLogEvent(level, (message = this.formatMessage(level, message)));
  }

  private static fireLogEvent(level: string, message: string) {
    const path = resolve(__dirname, this.log_path);
    const filePath = `${path}/${level}.log`;
    let exists = existsSync(filePath);
    if (!exists) closeSync(openSync(filePath, "a"));

    const logStream = createWriteStream(filePath, { flags: "a" });
    logStream.write(message);
  }
  private static formatMessage(level: string, message: string) {
    return `[ ${new Date().toISOString()} ] ${process.env.NODE_ENV.toUpperCase()}.${level.toUpperCase()} ${message}\n`;
  }

  public static info(message: string) {
    throw new Error("Log.debug() Não implementado ainda!");
  }

  public static debug(message: string) {
    throw new Error("Log.debug() Não implementado ainda!");
  }

  public static error(message: string) {
    this.writeLog(this.ERROR, message);
  }
}
