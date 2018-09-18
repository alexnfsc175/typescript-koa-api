import { Server } from './server';
import { usersRouter } from './routes/users/users.router';
import { usersMiddleware } from './middleware/user.middleware';
import { timeMiddleware } from './middleware/time.middleware';

const server = new Server();
server.bootstrap([usersRouter], [usersMiddleware, timeMiddleware]).then(server => {
    console.log(`Server is listening on ${server.getPort()}`);
}).catch(error => {
    console.log('Server failed to start');
    console.error(error);  
    process.exit(1);
}) 