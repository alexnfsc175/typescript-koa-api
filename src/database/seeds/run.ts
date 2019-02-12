import { Migrate } from './Migrate';
import UserMigration from './users';
import * as connections from '../../config/connection/connection';
// import { OAuthClients } from './oauthClients';

const migrate = new Migrate(connections);

migrate
    .run([new UserMigration()])
    .catch((error) => {
        console.error(error.stack);
        process.kill(process.pid);
    });