import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, getAllProducts, getAProduct } from "../controllers/product.controller.js";


const router=Router()

router.route("/createproduct").post(verifyJWT,upload.single('image'),createProduct)
router.route("/getallproducts").get(verifyJWT,getAllProducts)
router.route("/getaproduct").post(verifyJWT,getAProduct)

export default router;