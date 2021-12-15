import { ApolloServer, ApolloError, gql } from "apollo-server"//import del squema
import { connect } from "http2";
import { typeDefs } from "./schema";
//import { authenticate } from "./auth";
import { connectDB } from "./mongo";
//import { Query  } from "./resolvers/Query";
import { Mutation } from "./resolvers/Mutation";
const config = require('./config.js');
const data:string[] = [];


const resolvers = {
    //Query,
    Mutation
}


//config.ts
//.env
const run =async () => {
  try{
    const db = await connectDB();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async({req,res}) => {
        const abresesion = ["SignIn", "LogIn"];
        const cierrasesion = ["SignOut", "LogOut"]
        const pruebasesion = ["addIngredient", "addRecipie"] //separar?
        

        

       //const abresesion = ["SignIn", "LogIn"];
        if(abresesion.some(f => req.body.query.includes(f))){ //caso de ser signin o login
          
          const collection = db.collection("usuarios"); //QUITAR ESTA CONEXION AQUI?
          const email:string =  req.headers.email as string;
          const password:string =  req.headers.password as string;
          if(email == null || password == null){
            console.log("faltan email o contrasena")
            res.status(401)
            return "faltan email o contraseña"
          } 

          return{
            email,password,res
          }

          //const cierrasesion = ["SignOut", "LogOut"]
        }else if(cierrasesion.some(f => req.body.query.includes(f))){ //añadir cosas logeado
          const token = req.headers.token;
          if (token == null) return res.status(500).send("Falta token de sesion");

          const collection = db.collection("usuarios");
          const usuario = collection.findOne({token});                //await no hace falta
          if (usuario == null){
            return res.status(500).send("Token de sesion invalido");
          }
          return{token, res}
        }

        //const pruebasesion = ["addIngredient", "addRecipie"]
        else if(pruebasesion.some(f => req.body.query.includes(f))){ //añadir cosas logeado
          const token = req.headers.token;
          if (token == null) {
             res.status(500)
             console.log("ERROR");
            return"Falta token de sesion";
          }

          const collection = db.collection("usuarios");
          const author = await collection.findOne({token});
          if (author == null){
             res.status(500);
             console.log(`error`)
            return"Token de sesion invalido";
          }else{
            res.status(200);
            console.log(`author email: ${author!.email}`)
          }

          return{  token, res}
        }//fin añade cosas

      }


    });
  
    server.listen(config.PORT).then(() => {
      console.log("server escuchando en el puerto 3000");
    });
  } catch (e) {
    console.error(e);
  }
  }
  
  try {
    run();
  } catch (e) {
    console.error(e);
  }

// const run = async () => {
//     const client = await connectDB();
//     const server = new ApolloServer({
//         typeDefs,
//         //resolvers,
//         context: ({ req, res }) => {
//             const validtoken = ["pepi", "juan"];
//             const header = req.headers["token"];
//             console.log(header);
//             if (validtoken.some((q) => req.body.query.includes(q))) {
//                 if (req.headers["token"] !== "12345") res.sendStatus(403);
//             } else {
//                 return {
//                     data: "holaaaaaaa",
//                     client,
//                 };
//             }
//         },
//     });
//     server.listen(3000).then(() => {
//         console.log("Server escuchando en el puerto 3000");
//     });

// };


