import AccountController from '../../controllers/account.controller';
import * as Router from 'koa-router';
/**
 * @export
 * @class AccountRouter
 */
class AccountRouter {
    public router: Router;

    /**
     * Creates an instance of AccountRouter.
     * @memberof AccountRouter
     */
    constructor() {
        this.router = new Router();
        this.routes();
    }

    /**
     * @memberof AccountRouter
     */
    public routes(): void {
        this.router.get('/', AccountController.findAll);
        this.router.get('/:id', AccountController.find);
        this.router.post('/', AccountController.create);
        this.router.delete('/:id', AccountController.delete);
    }
}

export default new AccountRouter();
