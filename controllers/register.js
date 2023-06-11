
const handleRegister = (req, res, db, salt, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        console.log('Unable to register: Missing required fields');
        return res.status(400).json('unable to register');
    }
    const hash = bcrypt.hashSync(password, salt);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                console.log('Inserted into login table:', loginEmail[0].email);
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        console.log('Inserted into users table:', user[0]);
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => {
            console.log('Error occurred while registering:', err);
            res.status(400).json('not able to register');
        })
}

module.exports = {
    handleRegister: handleRegister
};