import * as debug from 'debug';
import * as http from 'http';
import Server from './server';
import * as serverHandlers from './serverHandlers';

debug('koa:server');

const port: string | number | boolean = serverHandlers.normalizePort(process.env.API_PORT || 3000);


console.log(`Server listening on port ${port}`); 

const server: http.Server = http.createServer(Server.callback());

// server listen
server.listen(port);

// server handlers
server.on(
    'error',
    (error: Error) => serverHandlers.onError(error, port));
server.on(
    'listening',
    serverHandlers.onListening.bind(server));
