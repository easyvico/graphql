const graphQL = require("graphql");
const lodash = require("lodash");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphQL;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields : {
    id : { type : GraphQLString },
    name : { type : GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
      id : { type : GraphQLString },
      firstName : { type : GraphQLString },
      age : { type : GraphQLInt },
      company : { 
        type : CompanyType,
        resolve(parentValue, args) {
          console.log(parentValue);
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