import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getOrder,
  updateOrderToPaid,
  getMyOrders,
} from '../controllers/orderController.js'
import { setOrderById } from '../middleware/setterMiddleware.js'
import { authToken, authOrder } from '../middleware/authMiddleware.js'

router.route('/').post(authToken, addOrderItems)
router.route('/myorders').get(authToken, getMyOrders)
router.route('/:id').get(authToken, setOrderById, authOrder, getOrder)
router
  .route('/:id/pay')
  .put(authToken, setOrderById, authOrder, updateOrderToPaid)

export default router
