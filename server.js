const express = require("express");
const expressGraphQL = require("express-graphql");
const userSchema = require("./schemas/schema")
const server = express();

server.use("/salutGraphQL", expressGraphQL({
  graphiql:true,
  schema : userSchema
}))

server.listen(4000, () => {
  console.log("Serveur est en écoute sur le port 4000");
})