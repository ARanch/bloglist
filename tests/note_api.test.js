const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

// ==== 18/12/2022, 22.19  ==== 
// make sure database is in same state when testing, always
// note that this actually clears the MongoDB online atm.
// use Jest beForeEarch() to clear and rewrite the database before test run
beforeEach(async () => {
    await Note.deleteMany({}) // delete notes
    let noteObject = new Note(helper.initialNotes[0])
    await noteObject.save()
    noteObject = new Note(helper.initialNotes[1])
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
    expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only Javascript')
})

// ==== 20/12/2022, 20.12  ==== 
// test api for adding notes
test('notes can be added', async () => {
    const noteContent = 'test adding a new note'
    const newNote = {
        content: noteContent,
        important: true
    }
    await api // posting new note 
        .post('/api/notes')
        .send(newNote)
        .expect(201) // "created"
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)

    expect(response.body).toHaveLength(helper.initialNotes.length + 1)
    expect(contents).toContain(noteContent)
})

test('empty note is not added', async () => {
    const emptyNote = {
        content: '',
        important: false
    }

    await api
        .post('/api/notes')
        .send(emptyNote)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/notes')
    const allNotes = await helper.notesInDb()
})

test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
})

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
        helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
})

afterAll(() => {
    mongoose.connection.close()
})