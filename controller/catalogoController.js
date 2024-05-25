
const {sequelize} = require("../config/sqlserver")
const { QueryTypes } = require('sequelize');
const { DataTypes } = require("sequelize")


exports.getProductos = async (req, res) => {

    try {
       
        const productos = await sequelize.query(`select * from mega_shoes_data.dbo.productos p `, {
          type: QueryTypes.SELECT,
          raw: true,
          plain: true
        });

      res
        .status(200)
        .send(productos);
    }catch (e){
        console.log("error: ", e)
        res.status(500).send("error en la creacion")
    }
  };