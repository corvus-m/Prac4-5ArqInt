import { Db, MongoClient } from "mongodb";
import { connectDB } from "../mongo";
import { v4 as uuid } from "uuid";
const crypto = require("crypto")



const hash = async (password:string) => {
    return new Promise((resolve, reject) => {
        const salt:string = crypto.randomBytes(8).toString("hex")
  
        crypto.scrypt(password, salt, 64, (err:any, derivedKey:any) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString("hex"))
        });
    }).catch(e =>{console.error("error");}
    )
  }
  
  const verify = async (password:string, hash:string) => {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 64, (err:any, derivedKey:any) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString("hex"))
        });
    }).catch(e =>{console.error(e);}
    )
  }
  

//   type User{
//     id: ID!
//     email: String!
//     pwd: String!
//     token: String
//     recipes: [Recipe!]!
//   }
  

export const Mutation ={

    SignIn: async (parent:any, args:any, {email,password,res}:{email:string, password:string,res:any}) => {
        const db = await connectDB();
        const collection = db.collection("usuarios"); 
        // console.log("\nHOLA");
        // console.log(email);
        if(email == null || password == null){
          console.log("faltan email o contrasena")
          res.status(401)
          return "faltan email o contraseña"
        }
  
        const existe = await collection.findOne({ email });
        if (existe) { 
            return res.status(409).send("Ya existe un usuario con este email.");
        }
        const password1 = await hash(password);


      
          const token = uuid();
      
          
          // const crypto = require("crypto")
      
       
          await collection.insertOne({ email, password:password1, token });
        console.log(`Bienvenido usuario, tu token de sesion es: ${token}`);
        res.status(200);
        return `Bienvenido usuario, tu token de sesion es: ${token}`;
    },


  
    LogIn: async (parent:any, args:any, {email,password,res}:{email:string, password:string,res:any}) => {
      const db = await connectDB();
      const collection = db.collection("usuarios");



      const usu = await collection.findOne({ email });
      if(usu !=null){
        //console.log("usuario EXISTE");
        const logged= usu!.token;
        //console.log(logged);
        if (logged != null) {
          console.log("usuario ya logeado");
          res.status(401)
          return "usuario ya logeado";
        } 

        else{
          const passwordDB:string = usu!.password;
          const verificado = await verify(password, passwordDB);

          if (verificado != null) { 
            const token = uuid();
            try{
              await collection.updateOne({ email }, {$set: { token: token } });
            } catch(e) {
              console.log(e);
            }
            console.log(`Bienvenido usuario, tu token de sesion es: ${token}`);
           return res.status(200).send({ token });
          } 

          else{
            return res.status(409).send("Contraseña incorrecta")
          }
        }
      
      
      } //fin usuario existe

      res.status(409).send("No existe ningun usuario con este email");
  },

  LogOut: async (parent:any, args:any, {token, res}:{token:string, res:any}) => {
   
    if(token == null){
      console.log("token invalido")
      res.status(401)
      return "token invalido"
    }
   
    const db = await connectDB();
    const collection = db.collection("usuarios"); 
    
    try{
      await collection.updateOne({token}, {$set: { token: undefined } }) 
    
    } catch(e) {
      console.log(e);
    }
      
    
    
    
    //fin usuario existe

    res.status(200);
    return "Sesion cerrada";
},

    addIngredient: async (parent:any, {name,  res}:{ name:string,   res:any}) => { //buscar primero si ya existe ese ingredient
        const db = await connectDB();
        const colRec= db.collection("recetas");
  
        const recipes= await colRec.find({}).toArray();
        if (recipes == null){
          res.status(404);
          console.log("F")
          return "error";
        }

        
        const recetas = recipes.filter(r => r.ingredients.some((i: string) => i === name));

        const colIng = db.collection("ingredientes");

        try{
          await colIng.insertOne({name,"recipes": recetas  });
        
        } catch(e) {
        console.log(e); 
      }
      //res.status(200);
        return  "Añadido ingrediente";
    },
    

    addRecipie: async (parent:any, {name, token, description, ingredientes, res}:{ name:string, token:string, description:string, ingredientes:string[], res:any}) => {
     //try{
      const db = await connectDB();
      const colIng = db.collection("ingredientes");
      
      //añadir caso de que falte un ingrediente?
     
      let faltaIng:boolean = false;
      
      const ingredients:any[] =  ingredientes.map( async i =>{ 
        console.log(i);
         let Ing:any = await colIng.findOne({name:i});
         if (Ing == null){
           console.log("falta Ing")
          faltaIng = true;
          return;
         }
          else {
            console.log("alo");
            return Ing
         }

       })

       if (faltaIng){
         return "Almenos uno de los ingredientes de la receta no ha sido añadido previamente"
       }

      const colRec= db.collection("recetas");

      const collection = db.collection("usuarios");

      const author = await collection.findOne({token});
      if(author != null){
        const nombre:string = author.email;
        console.log(`${nombre}`);
        console.log(`el nombre`);
      }else{
        console.log("Sin autor");

      }
      //console.log(author.name);

      try{
      const receta = await colRec.insertOne({name, description, ingredients, author }); //añadimos la receta
      
      if (receta){
        console.log("receta añadida");

        const recetaConID = await colRec.findOne({name});
        ingredientes.forEach( i => {
           colIng.updateOne({i}, {$push: { recetas:recetaConID  } })
          })
      }

      } catch(e) {
      console.log(e);

      }

      

      return "Añadida receta ingrediente";
    // } catch(e){
    //   console.log(e);
    // }
  }

  //   addRecipie: async (parent:any, {name, author, description, ingredientes, res}:{ name:string, author:any, description:string, ingredientes:string[], res:any}) => {
  //     const db = await connectDB();
  //     const colIng = db.collection("ingredientes");
      
  //     //añadir caso de que falte un ingrediente?

  //     let faltaIng:boolean = false;
      
  //     const ingredients:any[] =  ingredientes.map( async i =>{ 
  //       console.log(i);
  //        let Ing:any = await colIng.findOne({name:i});
  //        if (Ing == null){
  //          console.log("falta Ing")
  //         faltaIng = true;
  //         return;
  //        }
  //         else {
  //           console.log("alo");
  //           return Ing
  //        }

  //      })

  //      if (faltaIng){
  //        return "Almenos uno de los ingredientes de la receta no ha sido añadido previamente"
  //      }

  //     const colRec= db.collection("recetas");

  //     //const author = await db.collection("usuarios").findOne({token})

  //     console.log(author.name);

  //     try{
  //     const receta = await colRec.insertOne({name, description, ingredients, author }); //añadimos la receta
      
  //     if (receta){
  //       console.log("receta añadida");

  //       const recetaConID = await colRec.findOne({name});
  //       ingredientes.forEach( i => {
  //          colIng.updateOne({i}, {$push: { recetas:recetaConID  } })
  //         })
  //     }

  //     } catch(e) {
  //     console.log(e);

  //     }

      

  //     return "Añadida receta ingrediente";
    
  // }





}