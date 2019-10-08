const graphQL = require("graphql");
const lodash = require("lodash");
const axios = require("axios"); //permet de faire des requêtes http vers notre serveur json (ici recupérer l'url avec GET)

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphQL;

//on déclare un type de company
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields : {
    id : { type : GraphQLString },
    name : { type : GraphQLString }
  }
});

//on déclare un type d'utilisateur
const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
      id : { type : GraphQLString },
      firstName : { type : GraphQLString },
      age : { type : GraphQLInt },
      company : { 
        type : CompanyType,
        resolve(parentValue, args) {
          console.log('2- parentValue :',parentValue); //recupère les données parent user
          return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(response => {
            return response.data;
          })
        }
      }
  }
});

// fonction chargée de faire la requête vers le json server
const RootQuery = new GraphQLObjectType({
  name : 'RootQueryType',
  fields : {
      user : {
        type : UserType,
        args : {id : { type : GraphQLString }},
        resolve(parentValue, args){
          console.log('1- args :',args); //récupère l'argument (id)
          return axios.get(`http://localhost:3000/users/${args.id}`).then(response => {
            return response.data;
          })
        }
      }
  }
})

module.exports = new GraphQLSchema({
  query : RootQuery
})