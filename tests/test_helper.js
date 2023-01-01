const Note = require('../models/note')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true
    }
]

const initialBlogs = [
    {
        "title": "Den fede blog",
        "author": "Rango",
        "url": "www.sowasound.com",
        "likes": 1
    },
    {
        "title": "Sprøde ting",
        "author": "Flemming Foreverfed",
        "url": "www.flydenborg.com",
        "likes": 20
    },
]


const initialUser = {
    userName: 'Initial Blogs Test',
    name: 'Mr. Initial',
    password: 'abcdef'
}
const createInitialUser = async () => {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(initialUser.password, saltRounds)

    const user = new User({
        "userName": initialUser.userName,
        "name": initialUser.name,
        "passwordHash": passwordHash
    })

    const savedUser = await user.save()
    return savedUser
}



const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() })
    await note.save()
    await note.remove()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

/* 🔐 TOOLS FOR CREATING USER, LOGGING IN, AND TESTNIG
TOKEN BASED API CALLS.
*/
const supertest = require('supertest')
const app = require('../app')
// const { response: res } = require('../app')
const api = supertest(app)

/** Defines a user for logging in.
 * @returns the user object
 */
const defineUser = () => {
    const newUser = {
        userName: 'Blogs Test',
        name: 'Mr. Blog',
        password: 'abcdef'
    }
    return newUser
}

/** defines a blog
*/
const defineBlog = (userId) => {
    const newBlog = {
        title: 'A blog about awesome testing.',
        author: 'Someone',
        url: 'www.hej.com',
        likes: 10,
    }
    return newBlog
}

/** Saves the user to the DB 
 * @param {object} user object {userName, name, password}
*/
const saveUser = async (user) => {
    response = await api
        .post('/api/users')
        .send(user)
        .expect(201) // user created
    return response
}

/** logs the user in
 * @returns auth jwt token
 */
const logIn = async (user) => {
    // log in using the newly created user
    loggedIn = await api.post('/api/login')
        .send({
            'userName': user.userName,
            'password': user.password
        })
        .expect(200) // OK - login succesful
    return loggedIn.body.token
}

/** Creates a fresh user in the DB
 * @returns authorization token
 */
const makeDummyUser = async () => {
    const user = defineUser()
    newUser = await saveUser(user)
    const token = await logIn(user)
    return token
}

module.exports = {
    initialNotes,
    initialBlogs,
    initialUser,
    createInitialUser,
    nonExistingId,
    notesInDb,
    blogsInDb,
    usersInDb,
    makeDummyUser,
    defineBlog,

}