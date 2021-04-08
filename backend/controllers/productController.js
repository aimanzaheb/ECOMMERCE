import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//  @desc     Fetch all products
//  @route    GET /api/products
//  @access   Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  // res.status(401)
  // throw new Error('Not Authorized')
  res.json(products)
})

//  @desc     Fetch single product
//  @route    GET /api/products/:id
//  @access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found') //implicit & explicit exception will be handle by custom errorMiddleware because of express-async-handler

    //alternative way without express-async-handler but implicit exceptions will handle by 'default error handler' so it cant be reach to frontend
    // const error = new Error('Product not found')
    // next(error)
  }
})

//  @desc     Delete single product
//  @route    DELETE /api/products/:id
//  @access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    //if( product.user._id.equals(req.userId) ) //to delete only by that admin who created product

    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found') //implicit & explicit exception will be handle by custom errorMiddleware because of express-async-handler

    //alternative way without express-async-handler but implicit exceptions will handle by 'default error handler' so it cant be reach to frontend
    // const error = new Error('Product not found')
    // next(error)
  }
})

export { getProductById, getProducts, deleteProduct }
