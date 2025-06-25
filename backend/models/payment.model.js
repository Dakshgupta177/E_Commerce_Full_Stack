import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    Oid: {
      type: String,
      required: true,
    },
    productDetails: {
      type: Object,
      required: true,
    },
    payment_status:{
      type:String,
      default:"unpaid"
    },
    created:{
      type:Number,
    },
    amount:{
      type:Number,
    }
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);
