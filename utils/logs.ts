import log4js from 'log4js'

interface Log {
	message: string
	context: string
	labels?: Array<string>
}

export class Logger {
	constructor() {
		log4js.configure({
			appenders: {
				defaultLogs: {
					type: 'file',
					filename: `${process.cwd()}/logs/default.log`,
					maxLogSize: 1000000, // 10 MB
					backups: 1,
				},
				errorLogs: {
					type: 'file',
					filename: `${process.cwd()}/logs/error.log`,
					maxLogSize: 10000000, // 10 MB
					backups: 2,
				},
				httpLogs: {
					type: 'file',
					filename: `${process.cwd()}/logs/http.log`,
					maxLogSize: 1000000, // 10 MB
					backups: 3,
				},
			},
			categories: {
				default: {
					appenders: ['defaultLogs'],
					level: 'all',
				},
				errorLogs: {
					appenders: ['errorLogs'],
					level: 'error',
				},
				httpLogs: {
					appenders: ['httpLogs'],
					level: 'trace',
				},
			},
		})
	}

	private getDefaultLogger() {
		return log4js.getLogger('default')
	}

	private getErrorLogger() {
		return log4js.getLogger('errorLogs')
	}

	private getHttpLogger() {
		return log4js.getLogger('httpLogs')
	}

	private buildLabels(labels?: Array<string>) {
		return `[${labels?.join(', ')}]`
	}

	public trace(log: Log) {
		this.getHttpLogger().trace(
			`${this.buildLabels(log.labels)} ${log.context} - ${log.message}`,
		)
	}

	public debug(log: Log) {
		this.getDefaultLogger().debug(
			`${this.buildLabels(log.labels)} ${log.context} - ${log.message}`,
		)
	}

	public info(log: Log) {
		this.getDefaultLogger().debug(
			`${this.buildLabels(log.labels)} ${log.context} - ${log.message}`,
		)
	}

	public warn(log: Log) {
		this.getDefaultLogger().debug(
			`${this.buildLabels(log.labels)} ${log.context} - ${log.message}`,
		)
	}

	public error(log: Log) {
		this.getErrorLogger().error(
			`${this.buildLabels(log.labels)} ${log.context} - ${log.message}`,
		)
	}

	public fatal(log: Log) {
		this.getErrorLogger().debug(
			`${this.buildLabels(log.labels)} ${log.context} - ${log.message}`,
		)
	}
}
