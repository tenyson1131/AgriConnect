const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    let user = await User.findById(userId).populate("cart");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: quantity,
      image: product.images[0],
    };

    // creating cart for user if he doesn't have it
    if (!user.cart) {
      const newCart = new Cart({ user: user._id, items: [cartItem] });
      console.log("Generated Cart ID:", newCart._id);
      await newCart.save();

      user.cart = newCart._id;
      await user.save();

      return res.json({ message: "Added to cart", cart: newCart });
    }

    // if cart id already exist in user modal
    const cart = await Cart.findById(user.cart);
    if (!cart) {
      user.cart = null;
      await user.save();

      const newCart = new Cart({ user: user._id, items: [cartItem] });
      console.log("Generated Cart ID2:", newCart._id);
      await newCart.save();

      user.cart = newCart._id;
      await user.save();

      return res.json({ message: "Added to cart", cart: newCart });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push(cartItem);
    }

    await cart.save();
    return res.json({ message: "Added to cart", cart });
  } catch (error) {
    console.log("error while adding to cart", error);
    res.status(500).json({ message: "Error adding to cart", error });
  }
}

async function removeFromCart(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    let user = await User.findById(userId).populate("cart");
    if (!user || !user.cart)
      return res.status(404).json({ message: "User or Cart not found" });

    const cart = await Cart.findById(user.cart);
    cart.items = cart.items.filter((item) => item._id.toString() != productId);

    await cart.save();
    res.json({ message: "Removed from cart", cart });
  } catch (error) {
    console.log("Error while removing from cart", error);
    return res.status(500).json({ message: "Error removing from cart", error });
  }
}

async function getCart(req, res) {
  try {
    const userId = req.user._id;

    let user = await User.findById(userId).populate("cart");
    if (!user || !user.cart) return res.json({ items: [] });

    const cart = await Cart.findById(user.cart);
    return res.json({ items: cart.items });
  } catch (error) {
    console.log("Error while getting cart", error);
    return res.status(500).json({ message: "Error fetching cart", error });
  }
}

// maybe will add clear cart function later..

module.exports = { addToCart, removeFromCart, getCart };
