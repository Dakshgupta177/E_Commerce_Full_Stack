import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const corsOptions = {
  origin: "https://e-commerce-full-stack-frontend-4tzb.onrender.com",
  credentials: true,
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" })); // increase limit as necessary
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import stripeRoute from "./routes/stripe.route.js";
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/stripe", stripeRoute);
export { app };
