const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
    client: 'pg',
    connection: {
      host : 'postgresql-animate-93966',
      port : 5432,
      user : 'postgres',
      password : 'password',
      database : 'smartbrain'
    }
  });

const app = express();
const salt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//     res.send(database.users);
// })

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, salt, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })


app.listen(process.env.PORT || 3005, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})