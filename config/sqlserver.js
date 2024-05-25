/**
 * IMPORTAR EL ARCHIVO DE CONFIGURACIONES
 */
const cfg = require("../cf");
/**
 * IMPORTAR LA BIBLIOTECA DE SEQUELIZE
 */
const Sequelize = require("sequelize");
/**
 * CREAR LA CONEXIÓN DE SEQUELIZE
 */
console.log(cfg)
module.exports.sequelize = new Sequelize(
  cfg.sqlServerName,
  cfg.sqlServerUser,
  cfg.sqlServerPass,
  {
    host: cfg.sqlServerHost,
    port: cfg.sqlServerPort,
    dialect: cfg.sqlServerDialect,
    operatorsAliases: cfg.sqlServerOperatorsAliases,
    define: {
      timestamps: false
    },
    logging: cfg.sqlServerLogging, //muestra el query sql de la consulta, agregar false en produccion
    dialectOptions: {
      options: {
        instanceName: cfg.sqlServerInstance,
        connectTimeout: 60000,
        //ssl: true,
        encrypt: true,
        trustServerCertificate: true,
        cryptoCredentialsDetails: {
          ciphers: 'DEFAULT@SECLEVEL=0',
        }
      },
    },
    pool: {
      max: cfg.sqlServerPoolMax,
      min: cfg.sqlServerPoolMin,
      acquire: cfg.sqlServerPoolAcquire,
      idle: cfg.sqlServerPoolIdle,
    },
  }
);
/**
 * VERIFICAR QUE LA CONEXIÓN HA SIDO ESTABLECIDA
 */
function init() {
  console.log(`Sequelize ${cfg.sqlServerName} connection created!`);
}
/**
 * EXPORTAR EL ARCHIVO DE CONFIGURACION
 */

module.exports.init = init;
module.exports.Sequelize = Sequelize;
