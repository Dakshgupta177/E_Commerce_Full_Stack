// import axios from "axios";
import { Product } from "../models/product.model.js";
import axios from "axios";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createProduct = async (req, res) => {
  const { name, description, price, company, category, items } = req.body;
  const Price = Number(price)*1.2/80;
  const Items = Number(items);
  if (isNaN(Price) || isNaN(Items)) {
    return res.status(400).json({ message: "Price and items must be numbers" });
  }

  if (!name || !description || !price || !company || !category || !items) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  const productImageLocalPath = req.file?.path;
  console.log(req.file);

  if (!productImageLocalPath) {
    return res.status(400).json({ message: "Image is required" });
  }
  const productImage = await uploadOnCloudinary(productImageLocalPath);
  if (!productImage) {
    return res.status(400).json({
      message: "Image not uploaded successfully. Retry!!",
    });
  }
  console.log(productImage.secure_url);

  await Product.create({
    name,
    description,
    price: Price,
    company,
    category,
    items: Items,
    image: productImage.secure_url,
    images:[productImage.secure_url]
  });
  // // for Adding dummy data to the database

  // const product =await axios.get("https://dummyjson.com/products?limit=1994")
  // const data = product.data.products;
  // console.log(data[0])
  // const transformedData = data.map(item => ({
  //   name: item.title,
  //   description: item.description,
  //   price: item.price,
  //   company: item.brand,
  //   category: item.category,
  //   items: item.stock,
  //   image: item.thumbnail,
  //   images: item.images,
  //   rating: item.rating,
  //   reviews: item.reviews.map(review => ({
  //     rating: review.rating,
  //     comment: review.comment,
  //     reviewer_name: review.reviewerName,
  //   })),

  // }));
  // await Product.insertMany(transformedData)
  return res.status(200).json({
    message: "product is created successfully",
  });
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find();
  return res.status(200).json({
    products,
  });
};

export const getAProduct = async (req, res) => {
  const { Product_title } = req.body;
  if (!Product_title) {
    return res.status(400).json({message:"Product not found"})
  }

  const product = await Product.findOne({ name: Product_title });
  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }
  return res
    .status(200)
    .json({ message: "Product found successfully", product });
};
