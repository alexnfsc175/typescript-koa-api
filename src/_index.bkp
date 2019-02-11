import { Server } from './server';

const server = new Server();
server.bootstrap().then(server => {
    console.log(`Server is listening on ${server.port}`);
    console.log('Alex 3');
    
}).catch(error => {
    console.log('Server failed to start');
    console.error(error);  
    process.exit(1);
    console.log('oi');
    
}) 