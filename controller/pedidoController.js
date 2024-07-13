const { sequelize } = require("../config/sqlserver");
const { QueryTypes } = require("sequelize");

exports.getCatalogoclientesCodigo = async (req, res) => {
  let codigo = req.params.codigo;
  try {
    const clientes = await sequelize.query(
      `	 select DISTINCT codcli, nomcli, nit from grupo_sugua_data.dbo.clientes 
        --where codcli = ${codigo}
            `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        plain: true,
      }
    );

    res.status(200).send(clientes);
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};

exports.getCatalogoclientesNombre = async (req, res) => {
  let codigo = req.params.nombre;
  try {
    const clientes = await sequelize.query(
      `Select * from grupo_sugua_data.dbo.clientes 
                where nomcli like '%${codigo}%'
            `,
      {
        type: QueryTypes.SELECT,
        raw: true,
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
      `select id,cage, nage from grupo_sugua_data.dbo.ccage where activo = 1
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
