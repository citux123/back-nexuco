const { sequelize } = require("../config/sqlserver");
const { QueryTypes } = require("sequelize");
const { DataTypes } = require("sequelize");

exports.getProductos = async (req, res) => {
  let start = req.query._start;
  let limit = req.query._limit;
  let precio = req.query._precio;
  let search = req.query.q?.trim();

  try {
    /*  const productos = await sequelize.query(`SELECT 
              lineas.nlinea AS linea_producto,
              producto.cestilo AS codigo_producto, 
              producto.id as id_producto,
              colores.ncolor AS color, producto.nestilo AS descripcion, 
              ISNULL(stock.saldo_fin,0) AS existencia, 
              producto.precio, producto.costo, ISNULL(seg01.descripcion,'') AS grupo, 
              ISNULL(seg02.descripcion,'') AS division, ISNULL(seg03.descripcion,'') AS seccion, 
              ISNULL(seg04.descripcion,'') AS categoria, ISNULL(seg05.descripcion,'') AS sub_categoria,
              ISNULL(fProducto.imagen_producto,'') AS foto_producto 
            FROM mega_shoes_data.dbo.producto 
              INNER JOIN mega_shoes_data.dbo.lineas ON	lineas.empresa = (SELECT id FROM mega_shoes_data.dbo.sysparameters WHERE id = 2) AND producto.linea = lineas.linea
              INNER JOIN mega_shoes_data.dbo.colores	ON	colores.empresa = (SELECT id FROM mega_shoes_data.dbo.sysparameters WHERE id = 2) AND producto.ccolor = colores.ccolor
              LEFT  JOIN mega_shoes_data.dbo.stock	ON	stock.periodo = (SELECT periodo FROM mega_shoes_data.dbo.sysparameters WHERE id = 2 ) AND producto.id_prod = stock.id_prod 
              LEFT  JOIN mega_shoes_data.dbo.segmentacion	seg01 	ON 	producto.idgrupo = seg01.idgrupo AND seg01.iddivision = 0 AND 
                                            seg01.idseccion = 0 AND seg01.idcategoria = 0 AND seg01.idsubcategoria = 0 AND 
                                            seg01.idgrupo <> 0 
              LEFT  JOIN mega_shoes_data.dbo.segmentacion	seg02 	ON	producto.idgrupo = seg02.idgrupo AND seg02.iddivision = producto.iddivision AND 
                                            seg02.idseccion = 0 AND seg02.idcategoria = 0 AND seg02.idsubcategoria = 0 AND 
                                            seg02.iddivision <> 0 
              LEFT  JOIN mega_shoes_data.dbo.segmentacion	seg03 	ON	producto.idgrupo = seg03.idgrupo AND seg03.iddivision = producto.iddivision AND 
                                            seg03.idseccion = producto.idseccion AND seg03.idcategoria = 0 AND seg03.idsubcategoria = 0 AND 
                                            seg03.idseccion <> 0
              LEFT  JOIN mega_shoes_data.dbo.segmentacion	seg04 	ON	producto.idgrupo = seg04.idgrupo AND seg04.iddivision = producto.iddivision AND 
                                            seg04.idseccion = producto.idseccion AND seg04.idcategoria = producto.idcategoria AND 
                                            seg04.idsubcategoria = 0 AND seg04.idcategoria <> 0 
              LEFT  JOIN mega_shoes_data.dbo.segmentacion	seg05 	ON	producto.idgrupo = seg05.idgrupo AND seg05.iddivision = producto.iddivision AND 
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
        }); */

           const productos = await sequelize.query(`SELECT 
	
  ISNULL(seg1.descripcion,'N/D') AS linea_producto,   -- AS grupo, 
  ISNULL(seg1.descripcion,'N/D') AS grupo, 
  ISNULL(seg1.descripcion,'N/D') AS categoria, 
  ISNULL(seg1.descripcion,'N/D') AS sub_categoria, 
  productos.nestilo AS id_producto,
    productos.nestilo AS codigo_producto,
    productos.nestilo AS descripcion,
    	SUM(ISNULL(stock.cantidad,0)) AS existencia,
      productos.precio1 AS precio,
      productos.precio1 AS costo,
      ISNULL(marcas.nmarca,'') AS categoria, 
      ISNULL(marcas.nmarca,'') AS sub_categoria, 
 ISNULL(seg1.descripcion,'N/D') AS grupo, ISNULL(seg2.descripcion,'N/D') AS division,
	ISNULL(seg3.descripcion,'N/D') AS seccion, ISNULL(marcas.nmarca,'') AS marca, 
	RIGHT(CONVERT(VARCHAR(4),1000+productos.ccolor),3) + '  ' + colores.ncolor AS color,   
	productos.cestilo, productos.nestilo, productos.precio1 AS precio_lista,
	SUM(ISNULL(stock.cantidad,0)) AS stock_producto

FROM productos  
	INNER JOIN lineas				ON productos.linea	= lineas.linea   
	LEFT  JOIN marcas				ON productos.marca  = marcas.id
  	INNER JOIN colores				ON productos.ccolor = colores.ccolor   
  	INNER JOIN medidas				ON productos.um		= medidas.id  
	LEFT  JOIN segmentacion seg1	ON productos.idgrupo= seg1.idgrupo AND seg1.iddivision = 0 AND seg1.idseccion = 0 AND seg1.idcategoria = 0 AND seg1.idsubcategoria = 0
	LEFT  JOIN segmentacion seg2	ON productos.idgrupo= seg2.idgrupo AND seg2.iddivision = productos.iddivision AND seg2.idseccion = 0 AND seg2.idcategoria = 0 AND seg2.idsubcategoria = 0
	LEFT  JOIN segmentacion seg3	ON productos.idgrupo= seg3.idgrupo AND seg3.iddivision = productos.iddivision AND seg3.idseccion = productos.idseccion AND seg3.idcategoria = 0 AND seg3.idsubcategoria = 0
	LEFT  JOIN stock	ON stock.periodo	= (SELECT periodo FROM sysparameters) AND productos.id = stock.id_prod AND stock.ti = '1' 
WHERE  
	lineas.gdl = 1
GROUP BY 
	productos.linea, marcas.marca, marcas.nmarca, seg1.descripcion, seg2.descripcion, seg3.descripcion, productos.cestilo, productos.ccolor, 
	colores.ncolor, productos.codrun, medidas.medida, productos.nestilo, productos.precio1, productos.precio2, 
	productos.precio3, productos.precio4, productos.precio5, productos.precio6, productos.id 
ORDER BY 
	productos.linea, marcas.marca, productos.cestilo, productos.ccolor, productos.codrun  
   OFFSET ${start} ROWS 
            FETCH NEXT ${limit} ROWS ONLY
        `, {
          type: QueryTypes.SELECT,
          raw: true,
          //plain: true
        }); 
    
    res.status(200).send(productos);
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};

exports.getProducto = async (req, res) => {
  let codigo = req.params.id;
  try {
    const productos = await sequelize.query(
      `SELECT 
	
  ISNULL(seg1.descripcion,'N/D') AS linea_producto,   -- AS grupo, 
  ISNULL(seg1.descripcion,'N/D') AS grupo, 
  ISNULL(seg1.descripcion,'N/D') AS categoria, 
  ISNULL(seg1.descripcion,'N/D') AS sub_categoria, 
  productos.nestilo AS id_producto,
    productos.nestilo AS codigo_producto,
    productos.nestilo AS descripcion,
    	SUM(ISNULL(stock.cantidad,0)) AS existencia,
      productos.precio1 AS precio,
      productos.precio1 AS costo,
      ISNULL(marcas.nmarca,'') AS categoria, 
      ISNULL(marcas.nmarca,'') AS sub_categoria, 
 ISNULL(seg1.descripcion,'N/D') AS grupo, ISNULL(seg2.descripcion,'N/D') AS division,
	ISNULL(seg3.descripcion,'N/D') AS seccion, ISNULL(marcas.nmarca,'') AS marca, 
	RIGHT(CONVERT(VARCHAR(4),1000+productos.ccolor),3) + '  ' + colores.ncolor AS color,   
	productos.cestilo, productos.nestilo, productos.precio1 AS precio_lista,
	SUM(ISNULL(stock.cantidad,0)) AS stock_producto

FROM productos  
	INNER JOIN lineas				ON productos.linea	= lineas.linea   
	LEFT  JOIN marcas				ON productos.marca  = marcas.id
  	INNER JOIN colores				ON productos.ccolor = colores.ccolor   
  	INNER JOIN medidas				ON productos.um		= medidas.id  
	LEFT  JOIN segmentacion seg1	ON productos.idgrupo= seg1.idgrupo AND seg1.iddivision = 0 AND seg1.idseccion = 0 AND seg1.idcategoria = 0 AND seg1.idsubcategoria = 0
	LEFT  JOIN segmentacion seg2	ON productos.idgrupo= seg2.idgrupo AND seg2.iddivision = productos.iddivision AND seg2.idseccion = 0 AND seg2.idcategoria = 0 AND seg2.idsubcategoria = 0
	LEFT  JOIN segmentacion seg3	ON productos.idgrupo= seg3.idgrupo AND seg3.iddivision = productos.iddivision AND seg3.idseccion = productos.idseccion AND seg3.idcategoria = 0 AND seg3.idsubcategoria = 0
	LEFT  JOIN stock	ON stock.periodo	= (SELECT periodo FROM sysparameters) AND productos.id = stock.id_prod AND stock.ti = '1' 
WHERE  
	lineas.gdl = 1
  AND 
              productos.nestilo like '${codigo}'
              GROUP BY 
	productos.linea, marcas.marca, marcas.nmarca, seg1.descripcion, seg2.descripcion, seg3.descripcion, productos.cestilo, productos.ccolor, 
	colores.ncolor, productos.codrun, medidas.medida, productos.nestilo, productos.precio1, productos.precio2, 
	productos.precio3, productos.precio4, productos.precio5, productos.precio6, productos.id 
              ORDER BY codigo_producto 
          `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        plain: true,
      }
    );

    res.status(200).send(productos);
  } catch (e) {
    console.log("error: ", e);
    res.status(500).send("error en la creacion");
  }
};
