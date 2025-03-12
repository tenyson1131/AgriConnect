const Product = require("../models/Product");
const User = require("../models/User");

async function createProduct(req, res) {
  try {
    const { name, desc, price, images, category, stock, location } = req.body;
    if (!name || !desc || !price || !category || !stock || !location) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow farmers to create products
    if (user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can add products" });
    }

    const product = new Product({
      name,
      desc,
      price,
      images,
      category,
      stock,
      seller: userId,
      farmName: user.farmName,
      location,
    });

    await product.save();

    return res
      .status(200)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    console.log("error while creating product", error);
    return res.status(500).json({
      message: "Internal server error while creating product",
      error: error,
    });
  }
}

async function fetchProducts(req, res) {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  } catch (error) {
    console.log("error while fetching product", error);
    return res.status(401).json({
      message: "Internal server error while fetching product",
      error: error,
    });
  }
}

async function getProductById(req, res) {
  const { id } = req.params;
  console.log("type id:", typeof id);

  if (!id) {
    console.log("no product id found in request");
    return res
      .status(400)
      .json({ message: "Product id not found in request param" });
  }

  try {
    console.log("product id: ", id);

    const product = await Product.findOne({ _id: id });
    console.log("first product: ", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.log("error while fetching product by id", error);
    return res.status(500).json({
      message: "Internal server error while fetching product by id",
      error: error,
    });
  }
}

module.exports = { createProduct, fetchProducts, getProductById };
