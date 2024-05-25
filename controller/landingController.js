
const {sequelize} = require("../config/sqlserver")
const { QueryTypes } = require('sequelize');
const { DataTypes } = require("sequelize")


const Contacto = sequelize.define("DataContacto", {
    id_data_contacto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: true
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: true
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    comentarios: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_ingreso: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: "DataContacto",
    //timestamps: false
}
//freezeTableName: true
)


exports.setData = async (req, res) => {

    try {
        console.log("entrando a setdada  ++++++++++++++++")
    const body = req.body
    let data = body
    //let creado = await Contacto.findAll()
    let creado = await Contacto.create(data)
    console.log("creado : ", creado)

    //let users = await Contacto.findAll({raw: true})

      res
        .status(200)
        .send(creado);
    }catch (e){
        console.log("error: ", e)
        res.status(500).send("error en la creacion")
    }
  };