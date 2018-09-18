import { User } from '../../models/user.model';

const Users = [
    new User({
        name: 'Administrador',
        email: 'admin@admin.com.br',
        gender: 'MALE',
        password: User.schema.methods.generateHash('linux123'),
        phone: '11992382085',
        active: true,
        // permissions: [{
        //     type: 'admin',
        //     roles: ['read']
        // }],
        // location: {
        //     type: "Point",
        //     coordinates: [
        //         -23.4906188,
        //         -46.4246198
        //     ],
        //     createdAt: new Date(),
        //     updatedAt: new Date()
        // },
        // createdAt: new Date(),
        // updatedAt: new Date()
    })
]

export { Users };