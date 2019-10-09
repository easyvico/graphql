const graphQL = require("graphql");
const lodash = require("lodash");
const axios = require("axios"); //permet de faire des requêtes http vers notre serveur json (ici recupérer l'url avec GET)

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphQL;

//on déclare un type de company
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields : () => ({
    id : { type : GraphQLString },
    name : { type : GraphQLString },
    user : {
      type : GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then(response => {
          return response.data;
        })
      }
    }
  })
});

//on déclare un type d'utilisateur
const UserType = new GraphQLObjectType({
  name : 'User',
  fields : () => ({
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
  })
});

const MutationType = new GraphQLObjectType({
  name : 'Mutation',
  fields : () => ({
    addUser : {
      type : UserType,
      args : {
        firstName : { type: new GraphQLNonNull(GraphQLString)},
        age : { type: new GraphQLNonNull(GraphQLInt)},
        companyId : { type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/users/`,{firstname: args.firstName, age:args.age, companyId:args.companyId}).then(response => {
          return response.data;
        })
      }
    }
  })
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
      },
      company : {
        type: CompanyType,
        args : {id : { type : GraphQLString}},
        resolve(parentValue, args){
          return axios.get(`http://localhost:3000/companies/${args.id}`).then(response => {
            return response.data;
          })
        }
      }
  }
})

module.exports = new GraphQLSchema({
  query : RootQuery,
  mutation : MutationType
})