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

//  @desc     Update order to paid
//  @route    GET /api/orders/:id/pay
//  @access   Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Order not found')
  }
  if (!req.isAdmin && !order.user._id.equals(req.userId)) {
    //not work order.user._id === req.userId for mongo id
    res.status(404)
    throw new Error('Order not found')
  }

  order.isPaid = true
  order.paidAt = Date.now()
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  }
  const updatedOrder = await order.save()

  res.json(updatedOrder)
})

//  @desc     Get logged in user orders
//  @route    GET /api/orders/myorders
//  @access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.userId })

  if (!orders.length) {
    res.status(404)
    throw new Error('Orders not found')
  }

  res.json(orders)
})

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders }
