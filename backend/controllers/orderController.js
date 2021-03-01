import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'

//  @desc     Create new order
//  @route    POST /api/orders
//  @access   Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400) //bad request
    throw new Error('No order items')
  } else {
    const order = new Order({
      orderItems,
      user: req.userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

//  @desc     Get order by ID
//  @route    GET /api/orders/:id
//  @access   Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  ) //populating user model through userId in orderModel

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }
  if (!req.isAdmin && !order.user._id.equals(req.userId)) {
    //not work order.user._id === req.userId for mongo id
    res.status(404)
    throw new Error('Order not found')
  }

  res.json(order)
})

export { addOrderItems, getOrderById }
