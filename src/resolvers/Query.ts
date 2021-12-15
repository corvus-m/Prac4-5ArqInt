import { Db, MongoClient } from "mongodb";
import { connectDB } from "../mongo";

// export const Query = {
//     getRecipes: (parent: any, args: {}, { recipies, ingredients}) => {
//         return recipies.map((r, index) => ({
//             ...r,
//             //infredients: r.ingredients.map( i => ingredients[i].name);
//             id: index,
//         }));
//     },
//     getRecipe: (_, {id}, { recipies, ingredients}) => {
//         return recipies.map((r, index) => ({
//             ...recipies[id], 
//             id: index,
//         }));
//     },

// }


// //ESTOS CAMPOS SOLO SE MUESTRAN SI LOS PIDE EL CLIENTE, DE OTRA FORMA SERIA UN BUCLE INFINITO

//         //cada vez que devuelva algo de tipo receta, hace algo a los ingredientes
// export const Recipie = {
//     ingredients: (parent: {ingredients: number[]},  args: {}, { recipies, ingredients}) =>{ //que sifnifica parent?
//         //return parent.ingredients.map( (ing, index) => ({ // Para que esta el ing?
//             return parent.ingredients.map( ( index) => ({
//             ...ingredients[index],
//             id: index
//         }))

//     }
// }

//         //cada vez que devuelva algo de tipo receta, hace algo a los ingredientes
// export const Ingredient = { 
//     recipies: (parent: {id: number, name: string},  args: any, { recipies, ingredients}) =>{  //devolvera un objeto de recetas
//         return recipies.filter( r => r.ingredients.some(i => i === parent.id)) //recetas que contienen el ingrediente

//     }
// }