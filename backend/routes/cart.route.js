import { Router } from "express";
import { addCart, getCartDetails, minusCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router= Router()

router.route("/addtocart").post(verifyJWT,addCart)
router.route("/getcartdetails").get(verifyJWT,getCartDetails)
router.route("/minuscart").post(verifyJWT,minusCart)

export default router