import * as Router from 'koa-router';
import RoleController from '../../controllers/role.controller';

/**
 * @export
 * @class RoleRouter
 */
class RoleRouter {
    public router: Router;

    /**
     * Creates an instance of RoleRouter.
     * @memberof RoleRouter
     */
    constructor() {
        this.router = new Router();
        this.routes();
    }

    /**
     * @memberof RoleRouter
     */
    public routes(): void {
        this.router.get('/', RoleController.list);
  
    }
}

export default new RoleRouter();
