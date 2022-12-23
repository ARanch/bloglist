const supertest = require('supertest')
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ userName: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      userName: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const userNames = usersAtEnd.map(u => u.userName)
    expect(userNames).toContain(newUser.userName)
  })
})

describe('when users are added', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })
  test('returns 400 when name is less than 3 chars long', () => {
    const newUser = {
      userName: 'ro',
      name: 'Superuser',
      password: 'ohyeah'
    }
    api
      .post('api/users')
      .send(newUser)
      .expect(400)
  })

  test('returns error if password is shorter than 3', () => {
    const newUser = {
      userName: 'root',
      name: 'Superuser',
      password: 'oh'
    }
    api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('returns error if user exists', async () => {
    const existingUser = new User({
      userName: 'exister',
      name: 'Sum',
      password: 'ohyeah'
    })
    await existingUser.save(existingUser)

    api
      .post('/api/users')
      .send(existingUser)
      .expect(409)
  })
}) 