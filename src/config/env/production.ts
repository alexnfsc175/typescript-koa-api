/**
 * production config
 * will replace database config if NODE_ENV === 'production'
 */
export const envConfig: any = {
  database: {
    MONGODB_URI: "mongodb://production_uri/",
    MONGODB_DB_MAIN: "users_db"
  },
  lmx: {
    sp: {
      token: "kr93jgrbv7lw",
      wms_url: "http://lmx.nuccierp.com.br",
      wms_url_dev: "http://ndev02.nuccitms.com.br"
    },
    sc: {
      token: "",
      wms_url: ""
    }
  }
};
