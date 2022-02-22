const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const database = require('./data');
const axios = require("axios");
const req = require('express/lib/request');

const app = express();

app.set('view engine', 'hbs');

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');
app.use(express.urlencoded({extended: false}));

app.get('/', async function(req,res){
    let data = await database.getAll();
    res.render("index",{
        data: data
    });
})

app.get("/create", function(req,res){
    res.render("create");
})

app.post("/create", async function(req,res){
    // console.log(req.body);
    let title = req.body.title;
    let isbn = req.body.isbn;
    await database.addBook(title,isbn);
    res.redirect("/");
})

//show update page
app.get("/update/:id", async function(req,res){
    let id = Number(req.params.id);
    let book = await database.getBook(id);
    console.log(book);
    res.render("update",{
        book:book
    })
})

//update data when user click submit
app.post("/update/:id", async function(req,res){
    let id = Number(req.params.id);
    let title = req.body.title;
    let isbn = req.body.isbn;
    await database.updateBook(id, title, isbn);
    res.redirect("/");
})

//delete a book
app.get("/delete/:id", async function(req,res){
    let id = Number(req.params.id);
    let book = await database.getBook(id);
    console.log(book);
    res.render("delete",{
        book:book
    })
})

app.post("/delete/:id", async function(req,res){
    let id = Number(req.params.id);
    database.deleteBook(id);
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("Server has started");
})