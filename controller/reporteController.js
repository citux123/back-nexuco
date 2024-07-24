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
    try {
      const ventas = await sequelize.query(
        `
        EXEC	grupo_sugua_data.[dbo].[pibi_VentasxFechas] 
		@dfecha1 = '${data.fecha_inicio}',
		@dfecha2 = '${data.fecha_fin}', 
		@ncli1 = 1, 
		@ncli2 = 999999, 
		@nlin1 = 1, 
		@nlin2 = 99,
		@cces1 = N'', 
		@cces2 = N'ZZZZZZZZ',
		@ncol1 = 0, 
		@ncol2 = 999,
		@npro1 = 1,
		@npro2 = 999,
		@nage1 = 1,
		@nage2 = 999

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