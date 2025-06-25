import {
  getPaymentDetails,
  makeOnePayment,
  verifyPayment,
} from "../controllers/stripe.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/checkout", verifyJWT, makeOnePayment);
router.route("/verifypayment").post(verifyJWT, verifyPayment);
router.route("/getpaymentdetails").post(verifyJWT, getPaymentDetails);
export default router;
