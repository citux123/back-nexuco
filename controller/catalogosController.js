const { sequelize } = require("../config/sqlserver");
const { QueryTypes } = require("sequelize");

exports.getCatalogoclientes = async (req, res) => {
  try {
    let empresa = req.query.empresa || 2
    const clientes = await sequelize.query(
      `	 select codcli as value, nomcli as label, nit, direccion, direccion_recepcion_producto
       from grupo_sugua_data.dbo.clientes 
        where empresa = ${empresa}
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
        let empresa = req.query.empresa || 2
      const clientes = await sequelize.query(
        `select id, linea as value, nlinea as label from grupo_sugua_data.dbo.lineas 
        where empresa = ${empresa}
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
      let empresa = req.query.empresa || 2
      const clientes = await sequelize.query(
        `select id, ccolor as value, ncolor as label from grupo_sugua_data.dbo.colores 
        where empresa = ${empresa}`,
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
    let empresa = req.query.empresa || 2
    const vendedores = await sequelize.query(
      `select id,cage as value, nage as label from grupo_sugua_data.dbo.ccage 
      where activo = 1
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

exports.getCatalogoMenu = async (req, res) => {
try {
    let menu = []
    let submenu = []
    let opcion = []
    menu = await sequelize.query(
        `select * from grupo_sugua_data.dbo.portal_menu m`,
        {
            type: QueryTypes.SELECT,raw: true,
        }
    );
    submenu = await sequelize.query(
        `select * from grupo_sugua_data.dbo.portal_sub_menu`,
        {
            type: QueryTypes.SELECT,raw: true,
        }
    );
    opcion = await sequelize.query(
        `select * from grupo_sugua_data.dbo.portal_opcion m`,
        {
            type: QueryTypes.SELECT,raw: true,
        }
    );

    res.status(200).send({menu, submenu, opcion});
} catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
}
};

exports.getCatalogoSubMenu = async (req, res) => {
    try {
       
        const submenu = await sequelize.query(
            `select idSubMenu as value, nombreSubMenu as label from grupo_sugua_data.dbo.portal_sub_menu`,
            {
                type: QueryTypes.SELECT,raw: true,
            }
        );
        res.status(200).send(submenu);
} catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
}
};

exports.getCatalogoPortalOpcion = async (req, res) => {
    try {
        const opcion = await sequelize.query(
            `select idOpcion as value, nombreOpcion as label, nombreOpcion as titulo, 
            nombreStoreProcedure as short from grupo_sugua_data.dbo.portal_opcion m`,
            {
                type: QueryTypes.SELECT,raw: true,
            }
        );
    
        res.status(200).send(opcion);
    } catch (e) {
        console.log("error: ", e);
        res.status(500).send("error en la creacion");
    }
    };


exports.postCatalogoClientes = async (req, res) => {
  try {
    let data = req.body
    let empresa = 1

    let max = await sequelize.query(
      `SELECT ISNULL(MAX(codcli),0) + 1 AS ultimo FROM grupo_sugua_data.dbo.clientes
        `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        plain: true,
      })

    let nuevoCliente = await sequelize.query(
      `insert into grupo_sugua_data.dbo.clientes 
     (codcli,empresa,nit,nomcli,nomcli2,direccion,telefono,email,codven,transporte)
      values(${max.ultimo},${empresa},'${data.nit}','${data.nombre}','${data.propietario}','${data.direccion}',
      '${data.telefono}','${data.email}','${data.codven}','${data.transporte}')
        `,
      {
        type: QueryTypes.INSERT,
        returning: true,
      })
  
      res.status(200).send({valid: true, nuevoCliente})
  } catch (e) {
      console.log("error: ", e);
      res.status(500).send("error en la creacion");
  }
  };
  


