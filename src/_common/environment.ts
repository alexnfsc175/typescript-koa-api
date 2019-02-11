export const environment = {
    server: { port: process.env.API_PORT || 3000 },
    db: {
        url: `mongodb://${encodeURIComponent(process.env.BD_USER_NAME)}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT}/${process.env.DB_NAME}`, 
        // url:'mongodb://alexnfsc175:LyNx123%23@localhost:27017/koa',
        options: {
            poolSize: 5,
            promiseLibrary: global.Promise,
            authSource: 'admin',
            useNewUrlParser: true
        }
    }
}