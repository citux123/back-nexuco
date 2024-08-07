const { sequelize } = require("../config/sqlserver");
const { QueryTypes } = require("sequelize");

exports.getCatalogoclientes = async (req, res) => {
  try {
    const clientes = await sequelize.query(
      `	 select codcli as value, nomcli as label, nit, direccion, direccion_recepcion_producto
       from grupo_sugua_data.dbo.clientes 
        where empresa = 2
            `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        //plain: true,
      }
    );

    res.status(200).send(clientes);
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};

exports.getCatalogoLineas = async (req, res) => {
    try {
      const clientes = await sequelize.query(
        `select id, linea as value, nlinea as label from grupo_sugua_data.dbo.lineas where empresa = 2
              `,
        {
          type: QueryTypes.SELECT,
          raw: true,
          //plain: true,
        }
      );
  
      res.status(200).send(clientes);
    } catch (e) {
      console.log("error: ", e);
      res.status(500).send("error en la creacion");
    }
  };

  exports.getCatalogoColores = async (req, res) => {
    try {
      const clientes = await sequelize.query(
        `select id, ccolor as value, ncolor as label from grupo_sugua_data.dbo.colores where empresa = 2
              `,
        {
          type: QueryTypes.SELECT,
          raw: true,
          //plain: true,
        }
      );
  
      res.status(200).send(clientes);
    } catch (e) {
      console.log("error: ", e);
      res.status(500).send("error en la creacion");
    }
  };

exports.getCatalogoVendedores = async (req, res) => {
  try {
    const vendedores = await sequelize.query(
      `select id,cage as value, nage as label from grupo_sugua_data.dbo.ccage where activo = 1
        `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    res.status(200).send(vendedores);
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};

exports.getCatalogoProveedores = async (req, res) => {
    try {
      const vendedores = await sequelize.query(
        `select id, codpro as value, nombre as label, direccion, telefono from grupo_sugua_data.dbo.proveedores where activo = 1
          `,
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
  
      res.status(200).send(vendedores);
    } catch (e) {
      console.log("error: ", e);
      res.status(500).send("error en la creacion");
    }
  };
