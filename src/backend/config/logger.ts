import * as winston from "winston";
import * as dotenv from "dotenv";
import * as path from "path";
import * as httpContext from "express-http-context";
import DailyRotateFile from "winston-daily-rotate-file";
import * as Sentry from "@sentry/node";
import util from 'util'

dotenv.config({ path: path.join(__dirname, "../.env") });

export enum LogLevel {
  Info = "info",
  Error = "error",
  Debug = "debug",
  Fatal = "fatal",
}

interface LoggerConfig {
  level: LogLevel;
  filename: string;
  datePattern: string;
  format: winston.Logform.Format;
}

class Logger {
  private loggers: { [key in LogLevel]?: winston.Logger } = {};
  private logStatus: string = process.env.LOG_STATUS || "on";

  private static instance: Logger;

  private constructor() {
    this.initializeLoggers();
  }

  private getFormattedLogMessage(): winston.Logform.Format {
    const { printf } = winston.format;
    return printf(({ level, message, timestamp }) => {
      return `${timestamp} pid: ${process.pid} ${httpContext.get("reqId") ? `reqID: ${httpContext.get("reqId")} ` : ""
        }${level}: ${message}`;
    });
  }

  private initializeLoggers(): void {
    const { combine, timestamp, errors, colorize } = winston.format;
    const jsonFormat = this.getFormattedLogMessage();
    const errorsFormat = errors({ stack: true });
    const logVolume = process.env.LOG_VOLUME || "logs";

    const configs: LoggerConfig[] = [
      {
        level: LogLevel.Info,
        filename: `${logVolume}/info-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        format: combine(timestamp(), jsonFormat),
      },
      {
        level: LogLevel.Debug,
        filename: `${logVolume}/debug-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        format: combine(timestamp(), jsonFormat),
      },
      {
        level: LogLevel.Error,
        filename: `${logVolume}/error-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        format: combine(timestamp(), jsonFormat),
      },
    ];

    configs.forEach((config) => {
      this.loggers[config.level] = winston.createLogger({
        level: config.level,
        transports: [
          new DailyRotateFile({
            filename: config.filename,
            datePattern: config.datePattern,
            zippedArchive: true,
            format: config.format,
          }),
        ],
        exceptionHandlers: [
          new winston.transports.File({
            filename: `${logVolume}/exceptions.log`,
            format: combine(timestamp(), jsonFormat, errorsFormat),
          }),
        ],
        exitOnError: false,
      });

      this.loggers[config.level]?.add(
        new winston.transports.Console({
          format: combine(colorize(), timestamp(), jsonFormat),
        })
      );
    });
  }

  private sentryLogger(level: LogLevel, message: string, tag: string, data: any): void {
    const severityLevel: Sentry.SeverityLevel = level as Sentry.SeverityLevel;

    if ([LogLevel.Info].includes(level) && process.env.NODE_ENV === "PROD") { // ignore this flag for now
      Sentry.captureMessage(`${tag} => ${message} => ${JSON.stringify(data)}`, severityLevel);
    } else if ([LogLevel.Fatal, LogLevel.Error].includes(level)) {
      Sentry.captureException(data, { level: severityLevel, extra: { message } });
    }
  }

  public log(message: string, level: LogLevel = LogLevel.Info, tag: string = '', data: any = {}): void {
    if (this.logStatus === "on") {
      this.loggers[level]?.log({ level, message: `${tag} => ${message}` });
      if (typeof data === "object" && Object.keys(data).length > 0 && !(data instanceof Error)) {
        const formattedObj = util.inspect(data, { showHidden: false, depth: null, colors: true });
        this.loggers[level]?.log({ level, message: `${tag} => Log Data: ${formattedObj}` });
      } else if (data instanceof Error) {
        const errorString = `${data.name}: ${data.message}\n${data.stack}`;
        this.loggers[level]?.log({ level, message: `${tag} => Error: ${errorString}`, error: data });
      }
      this.sentryLogger(level, message, tag, data);
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}

export default Logger;
