import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

//  @desc     Auth user & get token
//  @route    POST /api/users/login
//  @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // res.send({ email, password }) //for test

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//  @desc     Register new user
//  @route    POST /api/users
//  @access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  //mongoose throw error "User validation failed: name: Path `name` is required., email: Path `email` is required., password: Path `password` is required" if we don't pass these fields from ajax or postman because they are required in userModel schema
  const user = await User.create({
    //create method syntactic sugar for doc save method
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//  @desc     Get user profile
//  @route    GET /api/users/profile
//  @access   Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Erro('User not found')
  }
})

export { authUser, registerUser, getUserProfile }
