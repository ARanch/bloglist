const dummy = (blogs) => {
  // ...
  const notUsed = blogs
  return 1
}

const listHelper = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return blogs.likes
  } else if (blogs.length > 1) {
    let likes = 0
    blogs.forEach(blog => { likes += blog.likes })
    return likes
  }
}

const favouriteBlog = (blogs) => {
  let favouriteIndex
  blogs.reduce((pre, curr, index) => {
    if (curr.likes > pre) {
      favouriteIndex = index
    } else { return 'error' }
  }, 0)
  const fav = {
    title: blogs[favouriteIndex].title,
    author: blogs[favouriteIndex].author,
    likes: blogs[favouriteIndex].likes
  }
  return fav
}

function myMain() {
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
  console.log(favouriteBlog(listWithTwoBlogs))
}

if (require.main === module) {
  myMain();
}

module.exports = {
  dummy,
  listHelper,
  favouriteBlog
}