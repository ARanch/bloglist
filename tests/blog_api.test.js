const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})

    const blogOjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogOjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
