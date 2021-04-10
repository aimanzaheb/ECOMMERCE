import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
} from '../controllers/productController.js'
import { authToken, authAdmin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(authToken, authAdmin, createProduct)

router
  .route('/:id')
  .get(getProductById)
  .delete(authToken, authAdmin, deleteProduct)
  .put(authToken, authAdmin, updateProduct)

export default router
