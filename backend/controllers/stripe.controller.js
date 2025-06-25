import Stripe from "stripe";
import { Payment } from "../models/payment.model.js";

export const makeOnePayment = async (req, res) => {
  const { product } = req.body;
  if (!product) {
    return res.status(400).json({ message: "Product is required" });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET);

  const lineItems = product.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 8000 * 0.8),
    },
    quantity: item.quantity || 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.VITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_URL}/cancel`,
    });
    console.log(session);
    await Payment.create({
      userId: req.user._id,
      Oid: session.id,
      productDetails: product,
    });
    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ message: "sessionID not provided" });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const User = await Payment.findOne({ Oid: sessionId });
  
  User.payment_status = session.payment_status;
  User.created = session.created;
  User.amount = session.amount_subtotal;

  await User.save({ validateBeforeSave: false });

  return res.status(200).json({ message: "ok" });
};

export const getPaymentDetails = async (req, res) => {
  const Data = await Payment.find({ userId: req.user._id });

  if (!Data) {
    return res.status(400).json({ message: "Data not found" });
  }
  return res.status(200).json({ message: "successfull get the data", Data });
};
