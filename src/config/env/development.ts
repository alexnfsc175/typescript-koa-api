/**
 * development config
 * will replace database config if NODE_ENV === 'development'
 */
export const envConfig: any = {
  database: {
    MONGODB_URI: `mongodb://${encodeURIComponent(
      process.env.BD_USER_NAME
    )}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST ||
      'localhost'}:${process.env.DB_PORT}`,
    MONGODB_DB_MAIN: process.env.DB_NAME
  }
};
