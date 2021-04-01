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
      token: generateToken(user._id, user.isAdmin),
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

//  @desc     Update user profile
//  @route    PUT /api/users/profile
//  @access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-password')
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password //pass will get hashed automatic because of userModel
    }

    let updatedUser
    try {
      updatedUser = await user.save() //used try catch because i cant pass callback function(err) here when using async/await
    } catch (err) {
      if (err.errors && err.errors.email && err.errors.email.message)
        //used mongoose-unique-validator in model for custom validation
        throw new Error(err.errors.email.message)
      else throw err
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//  @desc     Get all users
//  @route    GET /api/users
//  @access   Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

//  @desc     Delete user
//  @route    DELETE /api/users/:id
//  @access   Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  await user.remove()
  res.json({ message: 'User removed' })
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
}
