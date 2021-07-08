module.exports = {
    "development": {
        "username": "root",
        "password": process.env.DEVELOPMENT_DB_PASS,
        "database": "secret_south_new",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": process.env.PRODUCTION_DB_USER,
        "password": process.env.PRODUCTION_DB_PASS,
        "database": process.env.PRODUCTION_DB,
        "host": process.env.PRODUCTION_HOST,
        "dialect": "mysql"
    }
}
