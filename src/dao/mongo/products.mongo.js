//DAO Products Views Mongo
import ProductModel from "../../models/product.schema.js";
import { ObjectId } from "mongodb";


//DAO find by code
export const findByCode= async (code)=>{
    return await ProductModel.findOne({code:code});
} 

//DAO find all products
export const findWithLimit = async (limit)=>{
    return await  ProductModel.find().limit(limit);
}

//DAO find one by id
export const findById = async (id)=>{
    return await ProductModel.findOne({_id: new ObjectId(id)});
}

//DAO delete one by id
export const deleteById = async (id)=>{
    return await ProductModel.deleteOne({_id: new ObjectId(id)});
}

//DAO paginate
export const productPaginate = async (query, option)=>{
   return await ProductModel.paginate(query,option);
}

//DAO insert product 
export const insertProduct = async (data)=>{
    return await ProductModel.insertMany([data]).ObjectId;
}