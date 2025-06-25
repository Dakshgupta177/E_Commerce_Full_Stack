import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    reviews: [
      {
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        reviewer_name: {
          type: String,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      maxlength: 5,
    },
    items: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      required: true,
    },
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
