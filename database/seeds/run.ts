import { Migrate } from './Migrate';
import { OAuthClients } from './oauthClients';
import { Users } from './users';

const migrate = new Migrate();

migrate
    .run([...Users, ...OAuthClients])
    .catch((error) => {
        console.error(error.stack);
        process.kill(process.pid);
    });