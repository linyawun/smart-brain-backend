const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.POSTGRESQL_HOST,
    port: 30866,
    user: 'root',
    password: process.env.POSTGRESQL_PASSWORD,
    database: 'smart-brain-database',
    ssl: true,
  },
});

const app = express();
app.use(express.urlencoded({ extended: false })); //轉譯urlencoded內容
app.use(express.json()); //轉譯json內容
app.use(cors());

app.get('/', (req, res) => {
  res.send(`success ${process.env.POSTGRESQL_HOST}`);
});

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  //在監聽發生後執行第二個函式
  console.log(`app is running on port ${process.env.PORT || 3000}`);
});

/*
/ -> res = this is working
/signin -> POST = success/fail
/register -> POST = user
/profile/:userId -> GET = user
/image -> PUT -> user
*/
