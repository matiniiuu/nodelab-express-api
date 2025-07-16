export interface ILogger {
    error(message: string, meta?: { function: string }): void;
}
