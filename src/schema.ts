import { ApolloServer, ApolloError, gql } from "apollo-server"//import del squema
export const typeDefs = gql`
type User{
  id: ID!
  email: String!
  pwd: String!
  token: String
  recipes: [Recipe!]!
}

type Ingredient{
  id: ID!
  name: String!
  recipes: [Recipe!]!
}


type Recipe{
  id: ID!
  name: String!
  description: String!
  ingredients: [Ingredient!]!
  author: User!
}



type Query {
  getRecipes(id: ID!): Recipe
  getRecipe(id: ID!): Recipe
}

type Mutation {
    addIngredient(name:String): String
    addRecipie(name:String, description:String, ingredientes:[String]): String
    SignIn(email:String, password:String): String!
    LogIn(email:String, password:String): String!
    LogOut(token:String):String!
}
`
//updateRecipe(id: ID!, recipe): RecipeInput!