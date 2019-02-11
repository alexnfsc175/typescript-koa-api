import * as Koa from 'koa';
import { HttpError } from '../error';

/**
 * @export
 * @interface IServer
 */
export interface IServer {
    app: Koa;
}

/**
 * @export
 * @interface IConnectOptions
 */
export interface IConnectOptions {
    autoReconnect: boolean;
    reconnectTries: number; // Never stop trying to reconnect
    reconnectInterval: number;
    loggerLevel ? : string;
    poolSize: number;
    promiseLibrary: any;
    authSource: string;
    useNewUrlParser: true
}

/**
 *
 * @export
 * @interface CustomResponse
 * @extends {express.Response}
 */
export interface CustomResponse extends Koa.Response {
    sendHttpError: (error: HttpError | Error, message ? : string) => void;
}
