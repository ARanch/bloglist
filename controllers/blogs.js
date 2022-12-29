const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// ==== 29/12/2022, 21.17  ==== 
// needed for relating blogs to users
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization') // isolates token from request HEADER
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}
// ==== 29/12/2022, 21.17  ==== 
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { userName: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/clear/', async (request, response) => {
    await Blog.deleteMany({})
    return response.status(200)
})

blogsRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    // 🔻 ==== 29/12/2022, 21.26 Relating post to user 👤
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    // 🔺 ===============
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    // 🔻 ==== 29/12/2022, 21.57 
    // append blog to list of user blogs
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    // 🔺 ===============
    response.status(201).json(savedBlog)
})


blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }

    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.status(200).json(blog)
})

blogsRouter.delete('/:id', (request, response, next) => {
    Blogs.findById(request.params.id).delete()
    console.log(`Blog post with id ${request.params.id} deleted.`)
    response.statusCode(204).end()
})

module.exports = blogsRouter