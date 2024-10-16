
const {sequelize} = require("../config/sqlserver")
const { QueryTypes } = require('sequelize');
const { DataTypes } = require("sequelize")

let EMPRESAS = {
  SUGUA: 1
}

exports.getProductos = async (req, res) => {

  let start = req.query._start
  let limit = req.query._limit
  let precio = req.query._precio
  let search = req.query.q?.trim()
  let empresa = req.query.empresa

    try {
      let productos = []
      if (Number(empresa) === EMPRESAS.SUGUA) {
        productos = await sequelize.query(
          `
          SELECT 
            RIGHT(CONVERT(VARCHAR(4),1000+productos.linea),3) + '  ' + lineas.nlinea AS linea_producto,   
            --RTRIM(LTRIM(productos.cestilo))  AS codigo_producto,  
            productos.id AS id_producto,  
            RIGHT(CONVERT(VARCHAR(4),1000+productos.ccolor),3) + '  ' + colores.ncolor AS color, 
            RIGHT(CONVERT(VARCHAR(4),1000+productos.ccolor),3) + '  ' + colores.ncolor AS seccion,   
            RTRIM(LTRIM(productos.nestilo)) + ' ' + RTRIM(LTRIM(generos.ngenero)) AS descripcion, 
            ISNULL(stock.cantidad,0) AS existencia,  
            productos.precio1 as precio, productos.precio2, productos.precio3, productos.precio4,   
            productos.precio5, productos.precio6, productos.id AS codigo_producto  


            --RIGHT(CONVERT(VARCHAR(4),1000+productos.linea),3) + '  ' + lineas.nlinea AS linea,   
            --RTRIM(LTRIM(productos.cestilo))  AS codigo,  
            --RTRIM(LTRIM(productos.nestilo)) + ' ' + RTRIM(LTRIM(generos.ngenero)) AS producto_descripcion, 
            --RIGHT(CONVERT(VARCHAR(4),1000+productos.ccolor),3) + '  ' + colores.ncolor AS color,   
            --ISNULL(stock.cantidad,0) AS stock_producto,  
            --productos.precio1, productos.precio2, productos.precio3, productos.precio4,   
            --productos.precio5, productos.precio6, productos.id AS id_prod  
          FROM productos  
            INNER JOIN lineas ON productos.empresa= lineas.empresa AND productos.linea = lineas.linea   
            INNER JOIN colores ON productos.empresa= colores.empresa AND productos.ccolor = colores.ccolor   
            LEFT  JOIN productos_detalle ON productos.detalle= productos_detalle.id 
            LEFT  JOIN generos ON productos.empresa = generos.empresa AND productos.genero = generos.id 
            LEFT  JOIN stock_pibi stock ON stock.periodo = (SELECT periodo FROM sysparameters WHERE id = ${empresa}) AND productos.empresa= stock.empresa AND productos.id = stock.id_prod 
          WHERE 
            productos.empresa = 5

            ${precio ? "and productos.precio1 <= "+precio : "" }
            ${search ? "and productos.id like '%" + search + "%'" + 
              " Or productos.nestilo like '%"+search+"%'"  : ""}
            ${ search ? "" : `ORDER BY codigo_producto 
            OFFSET ${start} ROWS 
            FETCH NEXT ${limit} ROWS ONLY `} 
          `, {
            type: QueryTypes.SELECT,
            raw: true,
            //plain: true
          }
        )

      }
      else {
        productos = await sequelize.query(`SELECT 
              lineas.nlinea AS linea_producto,
              producto.cestilo AS codigo_producto, 
              producto.id as id_producto,
              colores.ncolor AS color, producto.nestilo AS descripcion, 
              ISNULL(stock.saldo_fin,0) AS existencia, 
              producto.precio, producto.costo, ISNULL(seg01.descripcion,'') AS grupo, 
              ISNULL(seg02.descripcion,'') AS division, ISNULL(seg03.descripcion,'') AS seccion, 
              ISNULL(seg04.descripcion,'') AS categoria, ISNULL(seg05.descripcion,'') AS sub_categoria,
              ISNULL(fProducto.imagen_producto,'') AS foto_producto 
            FROM grupo_sugua_data.dbo.producto 
              INNER JOIN grupo_sugua_data.dbo.lineas ON	lineas.empresa = (SELECT id FROM grupo_sugua_data.dbo.sysparameters WHERE id =1) AND producto.linea = lineas.linea
              INNER JOIN grupo_sugua_data.dbo.colores	ON	colores.empresa = (SELECT id FROM grupo_sugua_data.dbo.sysparameters WHERE id = 1) AND producto.ccolor = colores.ccolor
              LEFT  JOIN grupo_sugua_data.dbo.stock	ON	stock.periodo = (SELECT periodo FROM grupo_sugua_data.dbo.sysparameters WHERE id = 1 ) AND producto.id_prod = stock.id_prod 
              LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg01 	ON 	producto.idgrupo = seg01.idgrupo AND seg01.iddivision = 0 AND 
                                            seg01.idseccion = 0 AND seg01.idcategoria = 0 AND seg01.idsubcategoria = 0 AND 
                                            seg01.idgrupo <> 0 
              LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg02 	ON	producto.idgrupo = seg02.idgrupo AND seg02.iddivision = producto.iddivision AND 
                                            seg02.idseccion = 0 AND seg02.idcategoria = 0 AND seg02.idsubcategoria = 0 AND 
                                            seg02.iddivision <> 0 
              LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg03 	ON	producto.idgrupo = seg03.idgrupo AND seg03.iddivision = producto.iddivision AND 
                                            seg03.idseccion = producto.idseccion AND seg03.idcategoria = 0 AND seg03.idsubcategoria = 0 AND 
                                            seg03.idseccion <> 0
              LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg04 	ON	producto.idgrupo = seg04.idgrupo AND seg04.iddivision = producto.iddivision AND 
                                            seg04.idseccion = producto.idseccion AND seg04.idcategoria = producto.idcategoria AND 
                                            seg04.idsubcategoria = 0 AND seg04.idcategoria <> 0 
              LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg05 	ON	producto.idgrupo = seg05.idgrupo AND seg05.iddivision = producto.iddivision AND 
                                            seg05.idseccion = producto.idseccion AND seg05.idcategoria = producto.idcategoria AND 
                                            seg05.idsubcategoria = producto.idsubcategoria AND seg05.idsubcategoria <> 0 
              LEFT  JOIN grupo_sugua_images.dbo.producto_imagen fProducto	ON	producto.linea = fProducto.linea AND producto.cestilo = fProducto.cestilo AND producto.ccolor = fProducto.ccolor
            WHERE producto.linea = 1
            ${precio ? "and producto.precio <= "+precio : "" }
            ${search ? "and producto.cestilo like '" + search + "'" + 
              "Or producto.nestilo like '%"+search+"%'"  : ""}
            ${ search ? "" : `ORDER BY codigo_producto 
            OFFSET ${start} ROWS 
            FETCH NEXT ${limit} ROWS ONLY `} 
        `, {
          type: QueryTypes.SELECT,
          raw: true,
          //plain: true
        });

      }

      res
        .status(200)
        .send(productos);
    }catch (e){
        console.log("error: ", e)
        res.status(500).send("error en la creacion")
    }
  };

exports.getProducto = async (req, res) => {

    let codigo = req.params.id
    let empresa = req.query.empresa
    try {

      let productos = []
      if (empresa && Number(empresa) === EMPRESAS.SUGUA ){
        productos = await sequelize.query(
          `
          SELECT 
            RIGHT(CONVERT(VARCHAR(4),1000+productos.linea),3) + '  ' + lineas.nlinea AS linea_producto,   
            --RTRIM(LTRIM(productos.cestilo))  AS codigo_producto,  
            productos.id AS id_producto,  
            RIGHT(CONVERT(VARCHAR(4),1000+productos.ccolor),3) + '  ' + colores.ncolor AS color, 
            RIGHT(CONVERT(VARCHAR(4),1000+productos.ccolor),3) + '  ' + colores.ncolor AS seccion,   
            RTRIM(LTRIM(productos.nestilo)) + ' ' + RTRIM(LTRIM(generos.ngenero)) AS descripcion, 
            ISNULL(stock.cantidad,0) AS existencia,  
            productos.precio1 as precio, productos.precio2, productos.precio3, productos.precio4,   
            productos.precio5, productos.precio6, productos.id AS codigo_producto  


            --RIGHT(CONVERT(VARCHAR(4),1000+productos.linea),3) + '  ' + lineas.nlinea AS linea,   
            --RTRIM(LTRIM(productos.cestilo))  AS codigo,  
            --RTRIM(LTRIM(productos.nestilo)) + ' ' + RTRIM(LTRIM(generos.ngenero)) AS producto_descripcion, 
            --RIGHT(CONVERT(VARCHAR(4),1000+productos.ccolor),3) + '  ' + colores.ncolor AS color,   
            --ISNULL(stock.cantidad,0) AS stock_producto,  
            --productos.precio1, productos.precio2, productos.precio3, productos.precio4,   
            --productos.precio5, productos.precio6, productos.id AS id_prod  
          FROM productos  
            INNER JOIN lineas ON productos.empresa= lineas.empresa AND productos.linea = lineas.linea   
            INNER JOIN colores ON productos.empresa= colores.empresa AND productos.ccolor = colores.ccolor   
            LEFT  JOIN productos_detalle ON productos.detalle= productos_detalle.id 
            LEFT  JOIN generos ON productos.empresa = generos.empresa AND productos.genero = generos.id 
            LEFT  JOIN stock_pibi stock ON stock.periodo = (SELECT periodo FROM sysparameters WHERE id = ${empresa}) AND productos.empresa= stock.empresa AND productos.id = stock.id_prod 
          WHERE 
            productos.empresa = 5

            and productos.id like '${codigo}'
            ORDER BY codigo_producto 
          `, {
            type: QueryTypes.SELECT,
            raw: true,
            plain: true
          }
        )
      }
      else {
        productos = await sequelize.query(`SELECT 
             lineas.nlinea AS linea_producto,
             producto.cestilo AS codigo_producto, 
             producto.id as id_producto,
             colores.ncolor AS color, producto.nestilo AS descripcion, 
             ISNULL(stock.saldo_fin,0) AS existencia, 
             producto.precio, producto.costo, ISNULL(seg01.descripcion,'') AS grupo, 
             ISNULL(seg02.descripcion,'') AS division, ISNULL(seg03.descripcion,'') AS seccion, 
             ISNULL(seg04.descripcion,'') AS categoria, ISNULL(seg05.descripcion,'') AS sub_categoria,
             ISNULL(fProducto.imagen_producto,'') AS foto_producto 
           FROM grupo_sugua_data.dbo.producto 
             INNER JOIN grupo_sugua_data.dbo.lineas ON	lineas.empresa = (SELECT id FROM grupo_sugua_data.dbo.sysparameters WHERE id = 2) AND producto.linea = lineas.linea
             INNER JOIN grupo_sugua_data.dbo.colores	ON	colores.empresa = (SELECT id FROM grupo_sugua_data.dbo.sysparameters WHERE id = 2) AND producto.ccolor = colores.ccolor
             LEFT  JOIN grupo_sugua_data.dbo.stock	ON	stock.periodo = (SELECT periodo FROM grupo_sugua_data.dbo.sysparameters WHERE id = 2 ) AND producto.id_prod = stock.id_prod 
             LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg01 	ON 	producto.idgrupo = seg01.idgrupo AND seg01.iddivision = 0 AND 
                                           seg01.idseccion = 0 AND seg01.idcategoria = 0 AND seg01.idsubcategoria = 0 AND 
                                           seg01.idgrupo <> 0 
             LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg02 	ON	producto.idgrupo = seg02.idgrupo AND seg02.iddivision = producto.iddivision AND 
                                           seg02.idseccion = 0 AND seg02.idcategoria = 0 AND seg02.idsubcategoria = 0 AND 
                                           seg02.iddivision <> 0 
             LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg03 	ON	producto.idgrupo = seg03.idgrupo AND seg03.iddivision = producto.iddivision AND 
                                           seg03.idseccion = producto.idseccion AND seg03.idcategoria = 0 AND seg03.idsubcategoria = 0 AND 
                                           seg03.idseccion <> 0
             LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg04 	ON	producto.idgrupo = seg04.idgrupo AND seg04.iddivision = producto.iddivision AND 
                                           seg04.idseccion = producto.idseccion AND seg04.idcategoria = producto.idcategoria AND 
                                           seg04.idsubcategoria = 0 AND seg04.idcategoria <> 0 
             LEFT  JOIN grupo_sugua_data.dbo.segmentacion	seg05 	ON	producto.idgrupo = seg05.idgrupo AND seg05.iddivision = producto.iddivision AND 
                                           seg05.idseccion = producto.idseccion AND seg05.idcategoria = producto.idcategoria AND 
                                           seg05.idsubcategoria = producto.idsubcategoria AND seg05.idsubcategoria <> 0 
             LEFT  JOIN grupo_sugua_images.dbo.producto_imagen fProducto	ON	producto.linea = fProducto.linea AND producto.cestilo = fProducto.cestilo AND producto.ccolor = fProducto.ccolor
           WHERE 
           producto.cestilo like '${codigo}'
           ORDER BY codigo_producto 
       `, {
         type: QueryTypes.SELECT,
         raw: true,
         plain: true
       });
      }
  
        res
          .status(200)
          .send(productos);
      }catch (e){
          console.log("error: ", e)
          res.status(500).send("error en la creacion")
      }
    };