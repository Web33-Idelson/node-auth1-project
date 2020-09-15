const router = require('express').Router();
const bcryptjs = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    const rounds = process.env.HASH_ROUNDS || 4;
    const hash = bcryptjs.hashSync(password, rounds);

    Users.add({ username, password: hash })
        .then((users) => {
            res.status(201).json({ data: users })
        })
        .catch((err) => {
            res.json({ errorMessage: err.message })
        })
})

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .then(users => {
            const user = users[0]

            if(user && bcryptjs.compareSync(password, user.password)){
                req.session.loggedIn = true;

                res.status(200).json({
                    message: "you are logged in",
                    session: req.session
                })
            } else {
                res.status(401).json({ error: "your login info is not valid"})
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message })
        })
})


module.exports = router;