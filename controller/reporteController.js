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