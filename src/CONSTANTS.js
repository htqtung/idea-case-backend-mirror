const SERVER_SETTINGS = {

    port: 8787,

    api_url_prefix: "/api",

};

const DB_SETTINGS = {
    driverModule: "mysql",
    host: 'localhost',
    port: '3308',
    user: 'a1605339',
    password: 'haNIYM52y',
    database: 'a1605339',
    multipleStatements: true,
    debug: true,
    connPoolMin: 0,
    connPoolMax: 7
};

export {DB_SETTINGS, SERVER_SETTINGS};