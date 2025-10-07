const adminAuth = (req, res, next) => {
    const token = "xyz"
    const isAuthorized = token === "xyz"

    if (!isAuthorized) {
        res.send("Unauthorized request.")
    } else {
        next()
    }
}

const userAuth = (req, res, next) => {
    const token = "abc"
    const isAuthorized = token === "abc"
    
    if(!isAuthorized) {
        res.status(401).send("Unauthorized request")
    } else {
        next()
    }
}

module.exports = { adminAuth, userAuth };