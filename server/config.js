const config = {
    port: 8082,
    socketPort: 3004,
    clientPort: 8080,
    secret: 'JEFFJWT',
    exp: 60 * 60,
    dbUrl: 'mongodb://127.0.0.1:27017/mydb'
}

module.exports = config