import UserController from '../controllers/user.controller';
import * as Router from 'koa-router';
import { oauthServer } from '../../../helpers/oauthServer';// mudar para um do modulo
import IsAuthendicatedMiddleware from '../middleware/is-authenticated.middleware';
/**
 * @export
 * @class UserRouter
 */
class UserRouter {
    public router: Router;

    /**
     * Creates an instance of UserRouter.
     * @memberof UserRouter
     */
    constructor() {
        this.router = new Router();
        this.routes();
    }

    /**
     * @memberof UserRouter
     */
    public routes(): void {
        this.router.get('/authenticated',IsAuthendicatedMiddleware.use, UserController.authenticated);
        this.router.get('/', oauthServer.authenticate({scope:'admin', addAcceptedScopesHeader :true, addAuthorizedScopesHeader: true}) ,UserController.findAll);
        this.router.get('/:id', oauthServer.authenticate({scope:'admin', addAcceptedScopesHeader :true, addAuthorizedScopesHeader: true}), UserController.find);
        this.router.post('/', UserController.create);
        this.router.delete('/:id', UserController.delete);
    }
}

export default new UserRouter();
