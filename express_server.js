const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "t7UrE4": "http://www.macg.co"
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

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
    urls: urlDatabase };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  let templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

