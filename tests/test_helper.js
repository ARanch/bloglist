const Note = require('../models/note')

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

module.exports = {
    initialNotes,
    initialBlogs,
    nonExistingId,
    notesInDb
}