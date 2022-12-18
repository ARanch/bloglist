const listHelper = require('../utils/list_helper')
const favouriteBlog = require('../utils/list_helper').favouriteBlog
const listWithOneBlog = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    }
]
const listWithTwoBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
]
describe('total likes', () => {
    const emptyList = []

    test('of an empty list is zero', () => {
        const result = listHelper.listHelper(emptyList)
        expect(result).toBe(0)
    }
    )

    test('of one blog is likes of that', () => {
        const result = listHelper.listHelper(listWithOneBlog)
        expect(result).toBe(listWithOneBlog.likes)
    })

    test('of more than one blog is total likes', () => {
        const result = listHelper.listHelper(listWithTwoBlogs)
        const expectedTotalLikes = listWithTwoBlogs.reduce((acc, curr) => acc + curr.likes, 0)
        expect(result).toBe(expectedTotalLikes)
    })
})

describe('favourite blog', () => {
    test('is the blog with most likes', () => {
        const expected = {
            title: listWithTwoBlogs[0].title,
            author: listWithTwoBlogs[0].author,
            likes: listWithTwoBlogs[0].likes
        }
        expect(favouriteBlog(listWithTwoBlogs)).toMatchObject(expected)
    })
})