const { sequelize } = require("../config/sqlserver");
const { QueryTypes } = require("sequelize");

let EMPRESAS = {
  //SUGUA: 1,
  PLASTEC: 4,
  SUGUA: 5
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
    try {
        let data = req.body

        let max = await sequelize.query(
            `SELECT ISNULL(MAX(noped),0) + 1 AS ultimo_pedido FROM grupo_sugua_data.dbo.portal_pedidosm
              `,
            {
              type: QueryTypes.SELECT,
              raw: true,
              plain: true,
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
                })
        }
  
      res.status(200).send({valid: true, msg: "pedido ingresado correctamente", data: {pedido: max.ultimo_pedido}});
    } catch (e) {
      console.log("error: ", e);
      res.status(500).send("error en la creacion");
    }
  };

exports.setPedidosCorrida = async (req, res) => {
  try {
      let data = req.body
      let max = await sequelize.query(
          `SELECT ISNULL(MAX(noped),0) + 1 AS ultimo_pedido FROM grupo_sugua_data.dbo.portal_pedidosm
            `,
          {
            type: QueryTypes.SELECT,
            raw: true,
            plain: true,
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
      })

       for await (d of data.detalle) {
        let corridaTotales = 0

        {[...Array(18).keys()].map((i) => {
          const index = String(i + 1).padStart(2, "0"); // Formatea el índice con dos dígitos
          let cor = d.corrida
          corridaTotales = corridaTotales + Number(cor[`c${index}`])
        })}
    
          let detalle = {
              empresa: master.empresa,
              id_pedido: max.ultimo_pedido,
              id_prod: d.id_producto,
              run: d.corrida.run,
              costo: d.price,
              precio: d.price,
              c01: d.corrida.c01 !== " " ? d.corrida.c01 : 0,
              c02: d.corrida.c02 !== " " ? d.corrida.c02 : 0,
              c03: d.corrida.c03 !== " " ? d.corrida.c03 : 0,
              c04: d.corrida.c04 !== " " ? d.corrida.c04 : 0,
              c05: d.corrida.c05 !== " " ? d.corrida.c05 : 0,
              c06: d.corrida.c06 !== " " ? d.corrida.c06 : 0,
              c07: d.corrida.c07 !== " " ? d.corrida.c07 : 0,
              c08: d.corrida.c08 !== " " ? d.corrida.c08 : 0,
              c09: d.corrida.c09 !== " " ? d.corrida.c09 : 0,
              c10: d.corrida.c10 !== " " ? d.corrida.c10 : 0,
              c11: d.corrida.c11 !== " " ? d.corrida.c11 : 0,
              c12: d.corrida.c12 !== " " ? d.corrida.c12 : 0,
              c13: d.corrida.c13 !== " " ? d.corrida.c13 : 0,
              c14: d.corrida.c14 !== " " ? d.corrida.c14 : 0,
              c15: d.corrida.c15 !== " " ? d.corrida.c15 : 0,
              c16: d.corrida.c16 !== " " ? d.corrida.c16 : 0,
              c17: d.corrida.c17 !== " " ? d.corrida.c17 : 0,
              c18: d.corrida.c18 !== " " ? d.corrida.c18 : 0,
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
              })
       }

    res.status(200).send({valid: true, msg: "pedido ingresado correctamente", data: {pedido: max.ultimo_pedido}});

  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};


exports.getHistorialOrders = async (req, res) => {
  try {
    let {empresa, codven,start,limit} = req.query
    const pedidos = await sequelize.query(
      `select * from portal_pedidosm 
        where empresa = ${empresa} and codven = ${codven}
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
    if (Number(empresa) === EMPRESAS.PLASTEC) {
      console.log(" es sugua ")
      const pedidos = await sequelize.query(
        `select * from portal_pedidosd_mayoreo 
          where empresa = ${empresa} and id_pedido = ${id_pedido}
        `,
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).send(pedidos);
    }
    else {
      res.status(200).send([])
    }
    
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};
