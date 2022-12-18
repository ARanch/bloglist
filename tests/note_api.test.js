const { createTestScheduler } = require('jest')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const notesRouter = require('../controllers/notes')
const api = supertest(app)
const Note = require('../models/note')

// ==== 18/12/2022, 22.19  ==== 
// make sure database is in same state when testing, always
// note that this actually clears the MongoDB online atm.
const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
]

// use Jest beForeEarch() to clear and rewrite the database before test run
beforeEach(async () => {
    await Note.deleteMany({}) // delete notes
    let noteObject = new Note(initialNotes[0])
    await noteObject.save()
    noteObject = new Note(initialNotes[1])
    await noteObject.save()
})
// ========================================================

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 10000) // number is timeout. Default is 5000.

test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    // execution gets here only after the HTTP request is complete
    // the result of HTTP request is saved in variable response
    expect(response.body).toHaveLength(initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only Javascript')
})

afterAll(() => {
    mongoose.connection.close()
})