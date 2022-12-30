const supertest = require('supertest')
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const savedUser = await helper.createInitialUser()
    // add user id of savedUser to each of initial blogs
    helper.initialBlogs.forEach(blog => blog.user = savedUser.id)
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

    test.skip('posting a blog to /api/blogs works', async () => {
        const newBlog = {
            "title": "Den testing blog",
            "author": "Dr. Test",
            "url": "www.test.com",
            "likes": 0
        }

        api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const qtyBlogsAfter = await helper.blogsInDb()
        expect(qtyBlogsAfter).toHaveLength(helper.initialBlogs.length + 1)
    })

    test.skip('posting a blog with no like-prop defaults to 0 likes', async () => {
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
        expect(savedBlog.likes).toBe(0)
    })

    test.skip('posting a blog with no title or url is a bad request', async () => {
        const blogMissingData = {
            // title: 'fede tider',
            author: 'rango',
            // url: 'www.test.com'
        }

        await api.post('/api/blogs')
            .send(blogMissingData)
            .expect(400)

    })
})

describe('deletion of a blog', () => {
    test('deleting a blog with a specific id', async () => {
        // create user
        const newUser = {
            userName: 'Blogs Test',
            name: 'Mr. Blog',
            password: 'abcdef'
        }
        user = await api
            .post('/api/users')
            .send(newUser)
            .expect(201) // user created

        // log in using the newly created user
        loggedIn = await api.post('/api/login')
            .send({
                'userName': newUser.userName,
                'password': newUser.password
            })
            .expect(200) // OK - login succesful
        token = loggedIn.body.token

        // create blog with user
        const newBlog = {
            title: 'test users blog to delete',
            author: 'Someone',
            url: 'www.hej.com',
            likes: 10,
            user: user.body.id
        }

        const blogRes = await api.post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
        // console.log('🆔 of blog:', blogRes.body.id)

        const returnedBlog = await Blog.findById(blogRes.body.id)
        // console.log('🆔', returnedBlog.id)

        // test delete not allowed, since no authorization
        let response = api
            .delete(`/api/blogs/${blogRes.body.id}`)
            .expect(401) // unauthorized


        // test must not return 403 forbidden
        await api
            .delete(`/api/blogs/${returnedBlog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    })

    test(
        'deleting blog withouth auth fails', async () => {
            const blogs = await helper.blogsInDb()
            console.log('📖', blogs[0].id)
            console.log('📖', helper.initialBlogs[0])
            const blogToDelete = blogs[0]
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(401) // unathorized
        }
    )
})

describe('updating information of a blog', () => {
    test('updating likes', async () => {
        const blogToUpdate = await helper.blogsInDb()
        const originalLikes = blogToUpdate[0].likes
        blogToUpdate.likes = originalLikes + 10

        await api
            .put(`/api/blogs/${blogToUpdate[0].id}`)
            .send(blogToUpdate)
            .expect(200)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
