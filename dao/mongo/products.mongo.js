//DAO Products Views Mongo
import ProductModel from "../../models/product.schema.js";
import { ObjectId } from "mongodb";

class Product{

    //DAO find by code
    findByCode= async (code)=>{
        return await ProductModel.findOne({code:code});
    } 

    //DAO find all products
    findWithLimit = async (limit)=>{
        return await  ProductModel.find().limit(limit);
    }
    
    //DAO find one by id
    findById = async (id)=>{
        return await ProductModel.findOne({_id: new ObjectId(id)});
    }
    
    //DAO delete one by id
    deleteById = async (id)=>{
        return await ProductModel.deleteOne({_id: new ObjectId(id)});
    }
    
    //DAO paginate
    productPaginate = async (query, option)=>{
       return await ProductModel.paginate(query,option);
    }

    //DAO insert product 
    insertProduct = async (data)=>{
        return await ProductModel.insertMany([data]).ObjectId;
    }
}
export default Product;