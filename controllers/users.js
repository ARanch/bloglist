const bcrypt = require('bcrypt')
const { json } = require('express')
const usersRouter = require('express').Router()
const User = require('../models/user')
const passwordRequirement = 3

usersRouter.get('/clear/', async (request, response) => {
  await User.deleteMany({})
  return response.status(200)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('notes', { content: 1, date: 1 }) // object parameter chooses fields in note
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { userName, name, password } = request.body

  if (!userName) {
    return response.status(400).json({ error: 'must provide a username' })
  } else if (userName.length < 3) {
    return response.status(400).json({ error: 'username must be more than 3 characters long' })
  } else if (await User.findOne({ userName: userName })) {
    return response.status(409).json({ error: 'username already exists' })
  }

  if (!password) {
    return response.status(400).json({ error: 'no password provided' })
  } else if (password.length < passwordRequirement) {
    return response.status(400).json({
      error:
        `password must be at least ${passwordRequirement} character long`
    })
  }


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log('❌', 'passwordhash:', passwordHash)

  const user = new User({
    userName,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter