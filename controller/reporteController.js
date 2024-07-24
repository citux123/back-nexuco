const { sequelize } = require("../config/sqlserver");
const { QueryTypes } = require("sequelize");

exports.gerReporteVentas = async (req, res) => {
  let data = req.body;
  try {
    const ventas = await sequelize.query(
      `	select * from grupo_sugua_data.dbo.portal_pedidosm 
      where fecha BETWEEN  '${data.fecha_inicio}' and '${data.fecha_fin}'
            `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        //plain: true,
      }
    );

    res.status(200).send(ventas);
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};

exports.getReporteVentasCliente = async (req, res) => {
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

exports.gerReporteVentasxFecha = async (req, res) => {
    let data = req.body;
    let cliente1 = data.cliente_inicio !== "" ? data.cliente_inicio : 1
    let cliente2 = data.cliente_fin !== "" ? data.cliente_fin : 999999
    let linea1 = data.linea_inicio !== "" ? data.linea_inicio : 1
    let linea2 = data.linea_fin !== "" ? data.linea_fin : 99
    let color1 = data.color_inicio !== "" ? data.color_inicio : 0
    let color2 = data.color_fin !== "" ? data.color_fin : 999
    let proveedor1 = data.proveedor_inicio !== "" ? data.proveedor_inicio : 1
    let proveedor2 = data.proveedor_fin !== "" ? data.proveedor_fin : 999
    let vendedor1 = data.vendedor_inicio !== "" ? data.vendedor_inicio : 1
    let vendedor2 = data.vendedor_fin !== "" ? data.vendedor_fin : 999

    try {
      const ventas = await sequelize.query(
        `
        EXEC	grupo_sugua_data.[dbo].[pibi_VentasxFechas] 
		@dfecha1 = '${data.fecha_inicio}',
		@dfecha2 = '${data.fecha_fin}', 
		@ncli1 = ${cliente1}, 
		@ncli2 = ${cliente2}, 
		@nlin1 = ${linea1}, 
		@nlin2 = ${linea2},
		@cces1 = N'', 
		@cces2 = N'ZZZZZZZZ',
		@ncol1 = ${color1}, 
		@ncol2 = ${color2},
		@npro1 = ${proveedor1},
		@npro2 = ${proveedor2},
		@nage1 = ${vendedor1},
		@nage2 = ${vendedor2}

              `,
        {
          type: QueryTypes.SELECT,
          raw: true,
          //plain: true,
        }
      );
  
      res.status(200).send(ventas);
    } catch (e) {
      console.log("error: ", e);
      res.status(500).send("error en la creacion");
    }
  };