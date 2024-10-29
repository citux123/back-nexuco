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
    let empresa = data.empresa || 2
    let codven = data.codven

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
		@nage2 = ${vendedor2},
    @lnEmpresa1 = ${empresa},
    @lnCodven1 = ${codven}
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


  exports.gerReporteCarteraClientes = async (req, res) => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);

    const yearFull = date.getFullYear();
    const monthFull = ("0" + (date.getMonth() + 1)).slice(-2);

    const startDate = `${yearFull}-${monthFull}-01`;
    const lastDayOfMonth = new Date(yearFull, date.getMonth() + 1, 0).getDate();
    const endDate = `${yearFull}-${monthFull}-${("0" + lastDayOfMonth).slice(-2)}`;
    const periodoTemp = year + month;

    let data = req.body;
    let empresa = data.empresa ? data.empresa : 2
    let periodo = data.periodo !== "" ? data.periodo : periodoTemp
    let agente1 = data.agente1 ? data.agente1 : 1
    let agente2 = data.agente2 ? data.agente2 : 99
    let vendedor1 = data.vendedor_inicio !== "" ? data.vendedor_inicio : 1
    let vendedor2 = data.vendedor_fin !== "" ? data.vendedor_fin : 999
    let depto1 = data.depto1 ? data.depto1 : 1
    let depto2 = data.depto2 ? data.depto2 : 99
    let muni1 = data.muni1 ? data.muni1 : 1
    let muni2 = data.muni2 ? data.muni2 : 99
    let zona1 = data.zona1 ? data.zona1 : 0
    let zona2 = data.zona2 ? data.zona2 : 99
    let cliente1 = data.cliente_inicio !== "" ? data.cliente_inicio : 1
    let cliente2 = data.cliente_fin !== "" ? data.cliente_fin : 999999
    let diasT1 = data.diasT1 !== "" ? data.diasT1 : -999999
    let diasT2 = data.diasT2 !== "" ? data.diasT2 : 999999
    let fechaVenta1 = data.fecha_inicio !== "" ? data.fecha_inicio : startDate
    let fechaVenta2 = data.fecha_fin !== "" ? data.fecha_fin : endDate
    let tipoDoc1 = data.tipoDoc1 ? data.tipoDoc1 : 1
    let tipoDoc2 = data.tipoDoc2 ? data.tipoDoc2 : 2
    let tipoDoc3 = data.tipoDoc3 ? data.tipoDoc3 : 5
    let tipoDoc4 = data.tipoDoc4 ? data.tipoDoc4 : 6
    let tipoDoc5 = data.tipoDoc5 ? data.tipoDoc5 : 7
    let tipoDoc6 = data.tipoDoc6 ? data.tipoDoc6 : 3
    let tipoDoc7 = data.tipoDoc7 ? data.tipoDoc7 : 9
    let clienteBloqueado = data.clienteBloqueado ? data.clienteBloqueado : ''

    try {
      const ventas = await sequelize.query(
        `
        EXEC	grupo_sugua_data.[dbo].[${data.nivel}] 
		@lnEmpresa1 = '${empresa}',
		@lcPeriodo1 = '${periodo}', 
		@lnGrupoCodven1 = ${agente1}, 
		@lnGrupoACodven2 = ${agente2}, 
		@lnCodven1 = ${vendedor1}, 
		@lnCodven2 = ${vendedor2},
		@lnDepto1 = ${depto1}, 
		@lnDepto2 = ${depto2},
		@lnMuni1 = ${muni1}, 
		@lnMuni2 = ${muni2},
		@lnZona1 = ${zona1},
		@lnZona2 = ${zona2},
		@lnCodcli1 = ${cliente1},
		@lnCodcli2 = ${cliente2},
    @lnDiasTrans1 = ${diasT1},
    @lnDiasTrans2 =${diasT2},
    @ldFechaVentas1 = '${fechaVenta1}',
    @ldFechaVentas2 = '${fechaVenta2}',
    @lcTipoDoc1 = ${tipoDoc1},
    @lcTipoDoc2 = ${tipoDoc2},
    @lcTipoDoc3 = ${tipoDoc3},
    @lcTipoDoc4 = ${tipoDoc4},
    @lcTipoDoc5 = ${tipoDoc5},
    @lcTipoDoc6 = ${tipoDoc6},
    @lcTipoDoc7 = ${tipoDoc7},
    @lcCliBloqueado1 = '${clienteBloqueado}'
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