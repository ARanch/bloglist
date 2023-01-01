const supertest = require('supertest')
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = await helper.createInitialUser()
    // add user id of newUser to each of initial blogs
    helper.initialBlogs.forEach(blog => blog.user = newUser.id)
    const blogOjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    // save initital blogs
    const promiseArray = blogOjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when a blog is POSTed', () => {
    test('blogs are returned as json', async () => {
        api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('posting a blog to /api/blogs works', async () => {
        const newBlog = helper.defineBlog()
        const token = await helper.makeDummyUser()

        await api.post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const qtyBlogsAfter = await helper.blogsInDb()
        expect(qtyBlogsAfter).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('posting a blog with no like-prop defaults to 0 likes', async () => {
        const token = await helper.makeDummyUser()
        const newBlog = {
            'title': 'blog with no likes',
            'author': 'rango',
            'url': 'www.test.com'
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const savedBlog = await Blog.findOne({ title: 'blog with no likes' })
        expect(savedBlog.likes).toBe(0)
    })

    test('posting a blog with no title or url is a bad request', async () => {
        const token = await helper.makeDummyUser()
        const newBlog = helper.defineBlog()

        const missingUrl = Object.assign({}, newBlog)
        const missingTitle = Object.assign({}, newBlog)

        delete missingUrl.url
        delete missingTitle.title

        await api.post('/api/blogs')
            .send(missingTitle)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)

        await api.post('/api/blogs')
            .send(missingUrl)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    test('deleting a blog with a specific id', async () => {
        const token = await helper.makeDummyUser()
        const newBlog = helper.defineBlog()

        const blogRes = await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)

        // test must not return 403 forbidden
        api
            .delete(`/api/blogs/${blogRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    })

    test('deleting blog withouth auth fails', async () => {
        const blogs = await helper.blogsInDb()
        const blogToDelete = blogs[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401) // unathorized
    }
    )
})

describe('updating information of a blog', () => {
    test('updating likes', async () => {
        const token = helper.makeDummyUser()
        const blogToUpdate = await helper.blogsInDb()
        const originalLikes = blogToUpdate[0].likes
        blogToUpdate.likes = originalLikes + 10

        await api
            .put(`/api/blogs/${blogToUpdate[0].id}`)
            .send(blogToUpdate)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
