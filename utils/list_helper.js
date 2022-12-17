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
  return blogs[favouriteIndex].likes
}


module.exports = {
  dummy,
  listHelper,
  favouriteBlog
}