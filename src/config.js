const dotenv = require('dotenv').config();

module.exports ={
 
  PORT: process.env.PORT || 3000,
  usr: process.env.usr || "Mateo",
  pwd: process.env.pwd || "hG28d7HHpi4MK2C",
  dbName: process.env.dbName || "GraphQL"
}