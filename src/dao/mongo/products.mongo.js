//DAO Products Views Mongo
import ProductModel from "../../models/product.schema.js";
import { ObjectId } from "mongodb";

class Product {

    //DAO find by code
    findByCode = async (code, next) => {
        try {
            return await ProductModel.findOne({ code: code });
        } catch (error) {
            error.from = "mongo"
            return next(error)
        }
    }

    //DAO find all products
    findWithLimit = async (limit, next) => {
        try {
            return await ProductModel.find().limit(limit);
        } catch (error) {
            error.from = "mongo"
            next(error)
        }
    }

    //DAO find one by id
    findById = async (id, next) => {
        try {
            return await ProductModel.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            error.from = "mongo"
            next(error)
        }
    }

    //DAO delete one by id
    deleteById = async (id, next) => {
        try {
            return await ProductModel.deleteOne({ _id: new ObjectId(id) });
        } catch (error) {
            error.from = "mongo"
            next(error)
        }
    }

    //DAO paginate
    productPaginate = async (query, option, next) => {
        try {
            return await ProductModel.paginate(query, option);
        } catch (error) {
            error.from = "mongo"
            next(error)
        }
    }

    //DAO insert product 
    insertProduct = async (data, next) => {
        try {
            return await ProductModel.insertMany([data]);
        } catch (error) {
            error.from = "mongo"
            next(error)
        }

    }
}
export default Product;