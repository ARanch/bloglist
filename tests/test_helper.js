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

module.exports = {
    initialNotes,
    initialBlogs,
    initialUser,
    createInitialUser,
    nonExistingId,
    notesInDb,
    blogsInDb,
    usersInDb
}