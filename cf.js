const dotenv = require("dotenv")
dotenv.config()

module.exports = {
    
    port: process.env.PORT,

    sqlServerName: process.env.SQLSERVER_NAME,
    sqlServerUser: process.env.SQLSERVER_USERNAME,
    sqlServerPass: process.env.SQLSERVER_PASSWORD, 

    sqlServerHost: process.env.SQLSERVER_HOST,
    sqlServerPort: parseInt(process.env.SQLSERVER_PORT),
    sqlServerInstance: process.env.SQLSERVER_INSTANCE,
    sqlServerDialect: process.env.SQLSERVER_DIALECT,
    sqlServerLogging: !!parseInt(process.env.SQLSERVER_LOGGING),
    sqlServerOperatorsAliases: !!parseInt(
        process.env.SQLSERVER_OPERATORS_ALIASES
    ),
    sqlServerPoolMax: parseInt(process.env.SQLSERVER_POOL_MAX),
    sqlServerPoolMin: parseInt(process.env.SQLSERVER_POOL_MIN),
    sqlServerPoolAcquire: parseInt(process.env.SQLSERVER_POOL_ACQUIRE),
    sqlServerPoolIdle: parseInt(process.env.SQLSERVER_POOL_IDLE),

}