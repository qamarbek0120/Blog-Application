const {request, response} = require('express')
const express = require('express')
const app = express()
const fs = require('fs')
const fileUpload = require('express-fileupload')
const multer = require('multer')
const path = require('path')
const { title } = require('process')
const BodyParser = require('body-parser')
const fileName = './data/blogs.json';
const file = fileName






// to set needed file bases
app.set('view engine', 'pug')
// to use needed files and folders
app.use(express.json())
app.use('/static', express.static('public'))
app.use('/static', express.static('images'))
app.use(BodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended: false}))
//  Image upload
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
      cb(null, "public/images/");
    },
  
    filename: (request, file, cb) => {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
  
  let upload = multer({
    limits: {
      fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("Please upload a valid image file"));
      }
  
      cb(undefined, true);
    },
    storage: storage,
  });


// to get home page and reload it
app.get('/', (request, response)=>{
    response.render('home')
})
// to get blogs page and show all blogs created in JSON file
app.get('/allblogs', (request, response)=>{
    fs.readFile('./data/blogs.json', (error, data)=>{
        const blogs = JSON.parse(data)
        if (blogs === null){
            response.render('allblogs', { nodata: true })
        }
        else{
            response.render('allblogs', { blogs: blogs })
        }
        
    }) 
})
// to get create page to add data to JSON file and post it there
app.get('/create', (request, response)=>{
    response.render('create')
})
// to post recieved data to the JSOn file
app.post('/create', upload.single("image"), (request, response)=>{
    const title = request.body.title
    const description = request.body.description
    const username = request.body.username
    const category = request.body.category
    const timestamp = new Date()
    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const year = timestamp.getFullYear();
    const month = (timestamp.getMonth() + 1).toString().padStart(2, "0");
    const day = timestamp.getDate().toString().padStart(2, "0");
    const date = `${year}/${month}/${day}`;
    const done = request.body.done
    const image = request?.file.filename || ""
    console.log('request', request.file)
    console.log('image', image)
    if (title.trim() === ''){
        response.render('create', { error: true })
    }
    else if (title.length < 3){
        response.render('create', { invalidtitle: true})
    }
    else if (username.trim() === ""){
        response.render('create', { deserror: true })
    }
    // else if (username.match() != /^[a-zA-Z0-9 ]+$/){
    //     response.render('create', { invalidusername: true })
    // }
    else if (description.trim() === ''){
        response.render('create', { deserror: true })
    }
    else{
        fs.readFile('./data/blogs.json', (error, data) =>{
            if (error) throw error

            const blogs = JSON.parse(data)

            const blog = {
                id: id(),
                title: title,
                description: description,
                done: false,
                username: username,
                category: category,
                date,
                time,
                image
            }
            blogs.push(blog)
            fs.writeFile('./data/blogs.json', JSON.stringify(blogs), error=>{
                if (error) throw error

                response.render('create', { success: true })
            })
            
        })
    }
    
})
// to get about page and show it on the localhost
app.get('/about', (request, response)=>{
    response.render('about')
})
// to get each blog by its own ID
app.get('/allblogs/:id', (request, response)=>{
    const id = request.params.id
    fs.readFile('./data/blogs.json', (error, data)=>{
        if (error) throw error
        const blogs = JSON.parse(data)
        const blog = blogs.filter(blog => blog.id == id)[0]
        response.render('detail', { blog: blog })
    })
})
app.get('/api/v1/allblogs', (request, response)=>{
    fs.readFile('./data/blogs.json', (error, data)=>{
        if (error) throw error  
        const blogs = JSON.parse(data)
        response.json(blogs)
    }) 
})
// to get blog by ID and delete it
app.get('/:id/delete', (request, response)=>{
    const id = request.params.id

    fs.readFile('./data/blogs.json', (error, data)=>{
        if (error) throw error
        const blogs = JSON.parse(data)
        const filteredBlogs = blogs.filter(blog => blog.id != id)
        fs.writeFile('./data/blogs.json', JSON.stringify(filteredBlogs), (error)=>{
            if (error) throw error
            response.render('allblogs', { blogs: filteredBlogs, deleted: true })
        })
    })
})
// to edit the relevant data from JSON file but it does not work properly
app.get('/edit/:id', function(request, response) {
    fs.readFile(fileName, 'utf8', (error, data) => {
      if (error) throw error;
      const blogs = JSON.parse(data);
      const blog = blogs.find(blog => blog.id === request.params.id);
      response.render('edit', { title: 'Edit Page', blog });
    });
  });
//   to post the edited JSON data but it does not  properly
  app.post('/edit/:id', function(request, response) {
    const updatedData = request.body;
  
    fs.readFile(fileName, 'utf8', (error, data) => {
      if (error) throw error;
      const blogs = JSON.parse(data);
      const blog = blogs.findIndex(blog => blog.id === request.params.id);
      blogs[blog] = updatedData;
  
      fs.writeFile(fileName, JSON.stringify(blogs), (error) => {
        if (error) throw error;
        response.redirect('/allblogs');
      });
    });
  });
// to recieve and listen local host by the port number
app.listen(8000, error =>{
    if (error) console.log(error)

    console.log('Server is running on port 8000...')
} )
// this is uniqee id funtion to give each blog relevant ID
function id(){
    return '_' + Math.random().toString(36).substring(2, 9)
} 












