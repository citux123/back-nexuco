const { sequelize } = require("../config/sqlserver");
const { QueryTypes } = require("sequelize");

let EMPRESAS = {
  //SUGUA: 1,
  PLASTEC: 4,
  SUGUA: 5,
  CERCO: 2
}

exports.getCatalogoclientesCodigo = async (req, res) => {
  let codigo = req.params.codigo;
  try {
    let empresa = req.query.empresa || 2
    const clientes = await sequelize.query(
      `	 select codcli as value, nomcli as label, nit, direccion, direccion_recepcion_producto,codven,transporte
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
      `select id as value,cage, nage as label from grupo_sugua_data.dbo.ccage where activo = 1
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

exports.getCatalogoTransporte = async (req, res) => {
    try {
      const transporte = await sequelize.query(
        `select id as value, ntransporte as label,  * from grupo_sugua_data.dbo.transportes
          `,
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
  
      res.status(200).send(transporte);
    } catch (e) {
      console.log("error: ", e);
      res.status(500).send("error en la creacion");
    }
  };

exports.setPedidos = async (req, res) => {
  const transaction = await sequelize.transaction(); 
    try {
        let data = req.body

        let max = await sequelize.query(
            `SELECT ISNULL(MAX(noped),0) + 1 AS ultimo_pedido FROM grupo_sugua_data.dbo.portal_pedidosm
             where empresa = ${data.empresa}
              `,
            {
              type: QueryTypes.SELECT,
              raw: true,
              plain: true,
              transaction,
            })

        let master = {
            empresa: data.empresa,
            noped: max.ultimo_pedido,
            fecha: data.fecha,
            fecha_entrega: data.fecha_entrega,
            estatus: 1,
            codcli: data.codcli,
            codven: data.codven,
            nombre: data.nombre,
            id_transporte: data.id_transporte,
            direccion: data.direccion,
            direccion_entrega: data.direccion_entrega,
            operadopor: data.operadopor,
            feoperado: data.feoperado,
            total_venta: data.total_venta,
            total_unidades: data.total_unidades,
            observaciones: data.observaciones
        }

       let nuevoPedido = await sequelize.query(
        `insert into grupo_sugua_data.dbo.portal_pedidosm 
       (empresa,noped,fecha,fecha_entrega,estatus,codcli,codven,nombre,direccion,direccion_entrega,
       operadopor,feoperado,total_venta,total_unidades,observaciones,id_transporte)
        values(${master.empresa},${master.noped},'${master.fecha}','${master.fecha_entrega}',${master.estatus},
        ${master.codcli},${master.codven},'${master.nombre}','${master.direccion}','${master.direccion_entrega}',
        ${master.operadopor},'${master.feoperado}',${master.total_venta},${master.total_unidades},
        '${master.observaciones}',${master.id_transporte})
          `,
        {
          type: QueryTypes.INSERT,
          returning: true,
          transaction,
        })

        for await (d of data.detalle) {
    
            let detalle = {
                empresa: master.empresa,
                id_pedido: max.ultimo_pedido,
                id_prod: d.id_producto,
                costo: d.costo,
                cantidad: d.amount,
                precio: d.price,
                pordes: 0,
                valdes: 0,
                importe: d.amount * d.price,
                descrip: d.brandName,
                estatus: 1,
                um: 1
            }

             let nuevoDetalle = await sequelize.query(
                `insert into grupo_sugua_data.dbo.portal_pedidosd
               (empresa,id_pedido,id_prod,costo,precio,cantidad,pordes,valdes,importe,descrip,estatus,um)
                values(${detalle.empresa},${detalle.id_pedido},${detalle.id_prod},${detalle.costo},${detalle.precio},
                ${detalle.cantidad},${detalle.pordes},${detalle.valdes},${detalle.importe},'${detalle.descrip}',${detalle.estatus},
                ${detalle.um})
                  `,
                {
                  type: QueryTypes.INSERT,
                  returning: true,
                  transaction,
                })
        }
      await transaction.commit();
      res.status(200).send({valid: true, msg: "pedido ingresado correctamente", data: {pedido: max.ultimo_pedido}});
    } catch (e) {
      console.log("error: ", e);
      await transaction.rollback();
      res.status(500).send("error en la creacion");
    }
  };

exports.setPedidosCorrida = async (req, res) => {
  const transaction = await sequelize.transaction(); 
  try {
      let data = req.body
      let max = await sequelize.query(
          `SELECT ISNULL(MAX(noped),0) + 1 AS ultimo_pedido FROM grupo_sugua_data.dbo.portal_pedidosm
          where empresa = ${data.empresa}
            `,
          {
            type: QueryTypes.SELECT,
            raw: true,
            plain: true,
            transaction,
          })

      let master = {
          empresa: data.empresa,
          noped: max.ultimo_pedido,
          fecha: data.fecha,
          fecha_entrega: data.fecha_entrega,
          estatus: 1,
          codcli: data.codcli,
          codven: data.codven,
          nombre: data.nombre,
          id_transporte: data.id_transporte || 0,
          direccion: data.direccion,
          direccion_entrega: data.direccion_entrega,
          operadopor: data.operadopor,
          feoperado: data.feoperado,
          total_venta: data.total_venta,
          total_unidades: data.total_unidades,
          observaciones: data.observaciones
      }

      let nuevoPedido = await sequelize.query(
      `insert into grupo_sugua_data.dbo.portal_pedidosm 
      (empresa,noped,fecha,fecha_entrega,estatus,codcli,codven,nombre,direccion,direccion_entrega,
      operadopor,feoperado,total_venta,total_unidades,observaciones,id_transporte)
      values(${master.empresa},${master.noped},'${master.fecha}','${master.fecha_entrega}',${master.estatus},
      ${master.codcli},${master.codven},'${master.nombre}','${master.direccion}','${master.direccion_entrega}',
      ${master.operadopor},'${master.feoperado}',${master.total_venta},${master.total_unidades},
      '${master.observaciones}',${master.id_transporte})
        `,
      {
        type: QueryTypes.INSERT,
        returning: true,
        transaction,
      })

       for await (d of data.detalle) {
        let corridaTotales = 0

        {[...Array(18).keys()].map((i) => {
          const index = String(i + 1).padStart(2, "0"); // Formatea el índice con dos dígitos
          let cor = d.corrida
          corridaTotales = corridaTotales + Number(cor[`c${index}`])
        })}

        let corridaValues = {};
        for (let i = 1; i <= 18; i++) {
          const key = `c${String(i).padStart(2, "0")}`; 
          const value = d.corrida[key]; 
          corridaValues[key] = typeof value === "string" && value.trim() === "" 
            ? 0 
            : value != null 
              ? Number(value) || 0 
              : 0; 
        }
    
          let detalle = {
              empresa: master.empresa,
              id_pedido: max.ultimo_pedido,
              id_prod: d.id_producto,
              run: d.corrida.run,
              costo: d.price,
              precio: d.price,
              ...corridaValues, // Agregar c01 a c18
              cantidad: corridaTotales,
              pordes: 0,
              valdes: 0,
              importe: corridaTotales * d.price,
              descrip: d.brandName,
              estatus: 1,
              um: 1
          }
            let nuevoDetalle = await sequelize.query(
              `insert into grupo_sugua_data.dbo.portal_pedidosd_mayoreo
              (empresa,id_pedido,id_prod,run,costo,precio,c01,c02,c03,c04,c05,c06,c07,c08,c09,c10,c11,c12,c13,c14,c15,c16,c17,c18,
              cantidad,pordes,valdes,importe,descrip,estatus,um)
              values(${detalle.empresa},${detalle.id_pedido},${detalle.id_prod},'${detalle.run}',${detalle.costo},${detalle.precio},
              ${detalle.c01},${detalle.c02},${detalle.c03},${detalle.c04},${detalle.c05},${detalle.c06},${detalle.c07},${detalle.c08},${detalle.c09},
              ${detalle.c10},${detalle.c11},${detalle.c12},${detalle.c13},${detalle.c14},${detalle.c15},${detalle.c16},${detalle.c17},${detalle.c18},
              ${detalle.cantidad},${detalle.pordes},${detalle.valdes},${detalle.importe},'${detalle.descrip}',${detalle.estatus},
              ${detalle.um})
                `,
              {
                type: QueryTypes.INSERT,
                returning: true,
                transaction,
              })
       } 
    await transaction.commit();
    res.status(200).send({valid: true, msg: "pedido ingresado correctamente", data: {pedido: max.ultimo_pedido}});

  } catch (e) {
    await transaction.rollback();
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};


exports.getHistorialOrders = async (req, res) => {
  try {
    let {empresa, codven,start,limit} = req.query
    const pedidos = await sequelize.query(
      `select * from portal_pedidosm 
        where empresa = ${empresa} 
        ${Number(codven) === 0 ? "" : "and codven = " +codven }
        order by feoperado desc
        OFFSET ${start} ROWS 
        FETCH NEXT ${limit} ROWS ONLY 
      `,
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    res.status(200).send(pedidos);
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};

exports.getHistorialOrdersDetail = async (req, res) => {
  try {
    let {empresa, id_pedido} = req.query
    let pedidos = []
    if (Number(empresa) === EMPRESAS.PLASTEC) {
      pedidos = await sequelize.query(
        `
        select portal_pedidosd_mayoreo.*, colores.ncolor AS color from portal_pedidosd_mayoreo 
        INNER JOIN productos ON portal_pedidosd_mayoreo.id_prod = productos.id
        INNER JOIN colores	ON productos.empresa = colores.empresa AND productos.ccolor = colores.ccolor 
        where portal_pedidosd_mayoreo.empresa = ${empresa} and portal_pedidosd_mayoreo.id_pedido = ${id_pedido}
        `,
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).send(pedidos);
    }
    else if (Number(empresa) === EMPRESAS.SUGUA) {
      pedidos = await sequelize.query(
        ` select portal_pedidosd_mayoreo.*, colores.ncolor AS color from portal_pedidosd_mayoreo 
        INNER JOIN productos ON portal_pedidosd_mayoreo.id_prod = productos.id
        INNER JOIN colores	ON productos.empresa = colores.empresa AND productos.ccolor = colores.ccolor 
        where portal_pedidosd_mayoreo.empresa = ${empresa} and portal_pedidosd_mayoreo.id_pedido = ${id_pedido}
        `,
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).send(pedidos)
    }
    else if (Number(empresa) === EMPRESAS.CERCO) {
      pedidos = await sequelize.query(
        `select * from portal_pedidosd 
          where empresa = ${empresa} and id_pedido = ${id_pedido}
        `,
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).send(pedidos)
    }
    else {
      res.status(200).send([])
    }
    
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};
