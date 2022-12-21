const supertest = require('supertest')
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
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

// Write a test that verifies that making an 
// HTTP POST request to the /api/blogs url successfully
//  creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database. 

test('posting a blogs to /api/blogs works', async () => {
    const newBlog = {
        "title": "Den testing blog",
        "author": "Dr. Test",
        "url": "www.test.com",
        "likes": 0
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const qtyBlogsAfter = await helper.blogsInDb()
    expect(qtyBlogsAfter).toHaveLength(helper.initialBlogs.length + 1)
})

test('posting a blog with no like-prop defaults to 0 likes', async () => {
    const newBlog = {
        'title': 'blog with no likes',
        'author': 'rango',
        'url': 'www.test.com'
    }

    const response = await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const savedBlog = await Blog.findOne({ title: 'blog with no likes' })
    console.log(savedBlog)
    expect(savedBlog.likes).toBe(0)
})

test('posting a blog with no title or url is a bad request', async () => {
    const blogMissingData = {
        // title: 'fede tider',
        author: 'rango',
        // url: 'www.test.com'
    }

    await api.post('/api/blogs')
        .send(blogMissingData)
        .expect(400)

})

afterAll(() => {
    mongoose.connection.close()
})