import * as Router from 'koa-router';
import controller = require('../controllers');
import { oauthServer } from '../helpers/oauthServer';

const router = new Router();

// GENERAL ROUTES
// router.get('/', controllers.general.helloWorld);
// router.get('/jwt', controllers.general.getJwtPayload);

// USER ROUTES
router.get('/users', oauthServer.scope('edit'), controller.user.getUsers);
// router.get('/users/:id', controllers.user.getUser);
// router.post('/users', controllers.user.createUser);
// router.put('/users/:id', controllers.user.updateUser);
// router.delete('/users/:id', controllers.user.deleteUser);

export { router };