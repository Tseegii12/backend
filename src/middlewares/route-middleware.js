const { authenticatedAccount, getCurrentUser } = require("../helpers/accountHelper")

const checkToken = (req, res, next) => {
    let patt = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    const header = req.headers["authorization"]

    if (typeof header !== "undefined") {
        const bearer = header.split(" ")
        const token = bearer[1]

        authenticatedAccount(token)
            .then(({ authenticated }) => {
                if (authenticated) {
                    next()
                }
            })
            .catch((error) => res.status(400).json({ success: false, message: "Invalid token!" }))
    } else {
        res.status(403).json({ success: false, message: "Хандах эрхгүй байна" })
    }
}

const checkIsManager = (req, res, next) => {
    let patt = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    const header = req.headers["authorization"]
    const bearer = header.split(" ")
    const token = bearer[1]

    getCurrentUser(token)
        .then(({ user }) => {
            if (user && user.role[0]) {
                if (user.role[0].title.toLowerCase() === 'manager') {
                    req.body = {
                        ...req.body,
                        userId: user.id
                    }
                    next()
                } else {
                    res.status(400).json({ success: false, message: 'Хэрэглэгч нь менежер биш байна!' })
                }
            } else {
                res.status(404).json({ success: false, message: 'Хэрэглэгч олдсонгүй' })
            }
        })
}

module.exports = {
    checkToken,
    checkIsManager
}