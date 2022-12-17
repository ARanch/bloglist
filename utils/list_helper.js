const dummy = (blogs) => {
    // ...
    const notUsed = blogs
    return 1
  }

const listHelper = (blogs) () => {
    if (emptyList.length === 0) {
        return 0
    } else if (blog.length === 1) {
        return blog.likes
    } else if (blog.length > 1 ) {
        let likes = 0
        blog.forEach(blog => {likes += blog.likes})
        return likes
}
}

  
  module.exports = {
    dummy
  }