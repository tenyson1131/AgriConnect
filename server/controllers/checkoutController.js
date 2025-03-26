const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");

async function checkout(req, res) {
  try {
    const { paymentMethod, address } = req.body;
    if (!paymentMethod || !address) {
      return res
        .status(400)
        .json({ message: "field missing paymentMethod/address" });
    }

    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length == 0) {
      return res.status(400).json({ message: "Cart is empty!" });
    }

    const orders = [];
    const sellerOrders = {};
    let totalProductsOrdered = 0; // Track total ordered products

    // grouping item by seller.. so item of same seller gets in same obj/same group
    for (const item of cart.items) {
      const product = item.productId;
      if (!product || product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Stock unavailable for ${item.name}` });
      }

      if (!sellerOrders[product.seller]) {
        sellerOrders[product.seller] = {
          seller: product.seller,
          buyer: userId,
          products: [],
          totalAmount: 0,
          paymentMethod: paymentMethod,
          paymentStatus: paymentMethod == "COD" ? "Pending" : "Success",
          orderStatus: "Pending",
          address: address,
        };
      }

      sellerOrders[product.seller].products.push({
        productId: product._id,
        quantity: item.quantity,
        price: item.price,
      });

      sellerOrders[product.seller].totalAmount += item.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();

      totalProductsOrdered += item.quantity;
    }

    for (const sellerId in sellerOrders) {
      const newOrder = new Order(sellerOrders[sellerId]);
      await newOrder.save();
      orders.push(newOrder);
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { orderCount: totalProductsOrdered },
    });

    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    return res
      .status(200)
      .json({ message: "Order placed successfully", orders });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res
      .status(500)
      .json({ message: "erorr while doing checkout from server", error });
  }
}

async function fetchOrders(req, res) {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ buyer: userId })
      .populate("products.productId")
      .populate("seller")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    console.log("error fetching orders", error);
    return res.status(500).json({ message: "Error fetching orders", error });
  }
}

async function getSellerOrders(req, res) {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({ seller: sellerId })
      .populate("buyer")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching seller orders", error);
    return res
      .status(500)
      .json({ message: "Error fetching seller orders", error });
  }
}

module.exports = { checkout, fetchOrders, getSellerOrders };
