const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const engine = require('ejs-mate');
const userModel = require('./models/user');
const notesModel = require('./models/notes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const findNotes = require('./middleware/findNotes');
const isloggedin = require('./middleware/isLoggedin');
const upload = require('./config/multer-config');



app.engine('ejs', engine);
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get('/', function(req, res){
    if(req.cookies.token) return res.redirect('/dashboard');
    res.render('routes/userLogin');
})


app.get('/dashboard',isloggedin, findNotes, function (req, res) {
    let allPosts = req.posts;
    const profilePic = req.user.picture;
    res.render('routes/index', {allPosts, profilePic});
})


// Display the Create Notes Page
app.get('/notes/create',isloggedin, function (req, res) {
    const profilePic = req.user.picture;
    res.render('routes/createNotes', {profilePic});
})


// Create a New Note
app.post('/notes/create',isloggedin, async function (req, res) {
    let {title, note} = req.body;
    // let userEmail = jwt.verify(req.cookies.token, "secretString");
    // let user = await userModel.findOne({email: userEmail.email});
    let userid = req.user._id;

    let newNote = await notesModel.create({
        title, 
        note,
        userID: userid
        })
        let noteId = newNote._id;
    await req.user.notes.push(noteId);
    req.user.save();
    res.redirect('/dashboard');
})


// View Notes
app.get('/viewNote/:noteid',isloggedin, async function (req, res) {
    let noteid = req.params.noteid;
    let note = await notesModel.findOne({_id: noteid});
    const profilePic = req.user.picture;
    res.render('routes/readAndUpdateNotes', {note, profilePic});
})


// Update Note
app.post('/updateNote/:noteid',isloggedin, async function (req, res) {
    let {title, note} = req.body;
    let UpdatedNote = await notesModel.findOneAndUpdate({_id: req.params.noteid}, {title: title, note: note});
    res.redirect('/dashboard');
})


// Display User Signup Page
app.get('/user/create', function(req, res){
    res.render('routes/createUser');
})

// Create new User 
app.post('/user/create', upload.single("picture"), async function (req, res) {
    let { name, email, password } = req.body;
    let user = await userModel.findOne({email: email});
    if(user){
        console.log("Email already exists enter differenct email and try again");
        return res.redirect('/');
    } 

try {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            const createdUser = await userModel.create({
                name,
                email,
                password: hash,
                picture: req.file.buffer
            })
            const token = jwt.sign({ email: email }, "secretString");
            res.cookie("token", token);
            res.redirect('/dashboard');
        })
    })
} catch (error) {
    console.log(error.message);
    res.redirect('/');
}
   
})


app.get('/login', function(req, res){
    res.render('routes/userLogin');
})

// User login
app.post('/login',async function(req, res){
    let {email, password} = req.body;
    let user = await userModel.findOne({email: email});
    if(!user) return res.send("Email or password is incorrect");

    try {
        bcrypt.compare(password, user.password, function (err, result) {
            if(result){
                const token = jwt.sign({ email: email }, "secretString");
                res.cookie("token", token);
                console.log("you are loggedin")
                res.redirect('/dashboard');
            }
        })
        
    } catch (error) {
        console.log(error);
    }
})

// User logout
app.get('/logout', function(req, res){
    res.cookie("token", "");
    res.redirect('/');
})




app.listen(3000);