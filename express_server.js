const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.set("view engine", "ejs");

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
 "user3RandomID": {
    id: "user3RandomID", 
    email: "user3@example.com", 
    password: "yopolo-tamasa"
  },
 "user4RandomID": {
    id: "user4RandomID", 
    email: "user4@example.com", 
    password: "arguments-umbrella"
  },
 "user5RandomID": {
    id: "user5RandomID", 
    email: "user5@example.com", 
    password: "cat-watersalmon"
  }
}

const urlDatabase = {
   "user5RandomID" : { "b2xVn2": "http://www.lighthouselabs.ca" },
   "userRandomID" : { "9sm5xK" : "http://www.google.com" },
   "user2RandomID" : {"t7UrE4" : "http://www.macg.co" }
};

function generateRandomString() {
  const key = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let short = '';
  for(let i = 0; i < 6; i++) {
    short += key[Math.floor(Math.random() * key.length)];
  }
  if (urlDatabase.hasOwnProperty(short)) {
   generateRandomString();
  }
  return short;
}
//console.log(generateRandomString());

const isLogged = (req) => req.cookies.user_id ;


app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get('/login', (req, res) => {
  let templateVars = { user: users[req.cookies['user_id']] }
  res.render('login', templateVars);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!isLogged(req)) {
    res.redirect('/login');
  } else {  
  let templateVars = { user: users[req.cookies['user_id']] }
  res.render("urls_new", templateVars);
  };
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, 
    user: users[req.cookies['user_id']]};
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
    urls: urlDatabase,
    user: users[req.cookies['user_id']] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.get("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('urls');
});

app.post("/urls", (req, res) => {
  //console.log(req.body);  // debug statement to see POST parameters
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body['longURL'];
  //console.log(urlDatabase);
  res.redirect(`http://localhost:8080/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) =>  {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body[req.params.id];
  res.redirect('/urls');
});
app.post('/login', (req, res) => {
  let pass;
  let failPassword;
  for(const each in users){
    if (users[each]['email'] === req.body.email && users[each]['password'] === req.body.password) {
      //console.log(users[each]['email'], req.body.email, 'yes');
      res.cookie('user_id', users[each]['id']);
      pass = 1;
    } if (users[each]['email'] === req.body.email && users[each]['password'] !== req.body.password) {
      failPassword = 1;
    }; 
  };
  if(pass === 1) {
    res.redirect('/');
  };
  if (failPassword === 1) {
    res.status(403);
    res.send('None shall pass without entering the correct password!')
  } if(pass !== 1) {
    res.status(403);
    res.send('None shall pass without entering the correct email and password')
  }
  
});
app.post('/register', (req, res) => {
  let notExistingEmail = 1;
  // Condition, if the user enters an email and a password, then we can get the data
  if (req.body.email && req.body.password) {
    //this condition checks if the email entered already exists 
    for (const each in users) {
      //console.log(users[each]['email']);
      if (users[each]['email'] === req.body.email) {
        notExistingEmail = 0;
      };
    };
    if (notExistingEmail) {
      const usrName = generateRandomString();
      res.cookie('user_id', usrName);
      users[usrName] = {
        id: usrName,
        email: req.body.email,
        password: req.body.password
      };
    res.redirect('/urls');
    };
    if (notExistingEmail === 0) {
      res.status(400);
      res.send('Hey, this email is already registered in our database!');
    }
  } else {
  res.status(400);
  res.send('None shall pass without entering all the mandatory information');
  };
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

