const supertest = require('supertest')
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog');


beforeEach(async () => {
    await Blog.deleteMany({})

    const blogOjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogOjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when a blog is POSTed', () => {
    test('blogs are returned as json', async () => {
        api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

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
})

describe('deletion of a blog', () => {
    test('deleting a blog with a specific id', async () => {
        const firstBlog = await helper.blogsInDb()
        const blogToDelete = firstBlog[0]
        await api
            .delete(`/api/notes/${blogToDelete.id}`)
            .expect(204)
    })
})

describe('updating information of a blog', () => {
    test('updating likes', async () => {
        const blogToUpdate = await helper.blogsInDb()
        const originalLikes = blogToUpdate[0].likes
        blogToUpdate.likes = originalLikes+10

        await api
            .put(`/api/blogs/${blogToUpdate[0].id}`)
            .send(blogToUpdate)
            .expect(200)
    })
})

afterAll(() => {
    mongoose.connection.close()
})

// ==== 21/12/2022, 18.51  ==== 
// COURSE EXAMPLE OF THIS FILE!!
// ==== 21/12/2022, 18.52  ==== 

// const supertest = require('supertest')
// const mongoose = require('mongoose')
// const helper = require('./test_helper')
// const app = require('../app')
// const api = supertest(app)

// const Note = require('../models/note')

// beforeEach(async () => {
//   await Note.deleteMany({})
//   await Note.insertMany(helper.initialNotes)
// })

// describe('when there is initially some notes saved', () => {
//   test('notes are returned as json', async () => {
//     await api
//       .get('/api/notes')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//   })

//   test('all notes are returned', async () => {
//     const response = await api.get('/api/notes')

//     expect(response.body).toHaveLength(helper.initialNotes.length)
//   })

//   test('a specific note is within the returned notes', async () => {
//     const response = await api.get('/api/notes')

//     const contents = response.body.map(r => r.content)

//     expect(contents).toContain(
//       'Browser can execute only Javascript'
//     )
//   })
// })

// describe('viewing a specific note', () => {
//   test('succeeds with a valid id', async () => {
//     const notesAtStart = await helper.notesInDb()

//     const noteToView = notesAtStart[0]

//     const resultNote = await api
//       .get(`/api/notes/${noteToView.id}`)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
      
//     const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

//     expect(resultNote.body).toEqual(processedNoteToView)
//   })

//   test('fails with statuscode 404 if note does not exist', async () => {
//     const validNonexistingId = await helper.nonExistingId()

//     console.log(validNonexistingId)

//     await api
//       .get(`/api/notes/${validNonexistingId}`)
//       .expect(404)
//   })

//   test('fails with statuscode 400 if id is invalid', async () => {
//     const invalidId = '5a3d5da59070081a82a3445'

//     await api
//       .get(`/api/notes/${invalidId}`)
//       .expect(400)
//   })
// })

// describe('addition of a new note', () => {
//   test('succeeds with valid data', async () => {
//     const newNote = {
//       content: 'async/await simplifies making async calls',
//       important: true,
//     }

//     await api
//       .post('/api/notes')
//       .send(newNote)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)

//     const notesAtEnd = await helper.notesInDb()
//     expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

//     const contents = notesAtEnd.map(n => n.content)
//     expect(contents).toContain(
//       'async/await simplifies making async calls'
//     )
//   })

//   test('fails with status code 400 if data invalid', async () => {
//     const newNote = {
//       important: true
//     }

//     await api
//       .post('/api/notes')
//       .send(newNote)
//       .expect(400)

//     const notesAtEnd = await helper.notesInDb()

//     expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
//   })
// })

// describe('deletion of a note', () => {
//   test('succeeds with status code 204 if id is valid', async () => {
//     const notesAtStart = await helper.notesInDb()
//     const noteToDelete = notesAtStart[0]

//     await api
//       .delete(`/api/notes/${noteToDelete.id}`)
//       .expect(204)

//     const notesAtEnd = await helper.notesInDb()

//     expect(notesAtEnd).toHaveLength(
//       helper.initialNotes.length - 1
//     )

//     const contents = notesAtEnd.map(r => r.content)

//     expect(contents).not.toContain(noteToDelete.content)
//   })
// })

// afterAll(() => {
//   mongoose.connection.close()
// })