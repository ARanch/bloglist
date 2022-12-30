// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const loginRouter = require('express').Router()
// const User = require('../models/user')

// loginRouter.post('/', async (request, response) => {
//     const { userName, password } = request.body

//     const user = await User.findOne({ userName })
//     const passwordCorrect = user === null
//         ? false
//         : await bcrypt.compare(password, user.passwordHash)

//     if (!(user && passwordCorrect)) {
//         return response.status(401).json({
//             error: 'invalid username or password'
//         })
//     }

//     const userForToken = {
//         username: user.userName,
//         id: user._id
//     }

//     const token = jwt.sign(
//         userForToken,
//         process.env.SECRET,
//         // { expiresIn: 60 * 60 }) // AUTO EXPIRES the token after 60 minutes!

//         response
//             .status(200)
//             .send({ token, username: user.userName, name: user.name })
//     )
// })

// module.exports = loginRouter
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { userName, password } = request.body
    const user = await User.findOne({ userName })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.userName,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.userName, name: user.name })
})

module.exports = loginRouter