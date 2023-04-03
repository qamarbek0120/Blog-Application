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







app.set('view engine', 'pug')

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



app.get('/', (request, response)=>{
    response.render('home')
})
app.get('/allblogs', (request, response)=>{
    fs.readFile('./data/blogs.json', (error, data)=>{
        const blogs = JSON.parse(data)
        response.render('allblogs', { blogs: blogs })
    }) 
})
app.get('/create', (request, response)=>{
    response.render('create')
})

app.post('/create', upload.single("image"), (request, response)=>{
    const title = request.body.title
    const description = request.body.description
    const username = request.body.username
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
    else if (username.match() != /^[a-zA-Z0-9 ]+$/){
        response.render('create', { invalidusername: true })
    }
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


// Image upload






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



// EDITING
// app.get('/:id/edit', async (req, res) => {
//     const id = req.params.id
//     const username = await username.findByPk(id)

//     res.render('edit', {
//         title: title,
//         description: description
//     })
// })

// app.get('/:id/update', (request, response)=>{
//     const id = request.params.id

//     fs.readFile('./data/blogs.json', (error, data)=>{
//         if (error) throw error 
//         const blogs = JSON.parse(data)
//         const blog = blogs.filter(blog => blog.id == id)[0]
//         const blogIndex = blogs.indexOf(blog)
//         const spliceBlog = blogs.splice(blogIndex, 1)[0]
//         blogs.push(spliceBlog)

//         fs.writeFile('./data/blogs.json', JSON.stringify(data), (error)=>{
//             if (error) throw error
//             response.render('detail', { blogs: blogs })
//         })
//     })
    
      
// })

// app.get('/:id/edit', (request, response)=>{
//     const id = request.params.id
//     fs.readFile('./data/blogs.json', (error, data)=>{
//         if (error) throw error
//         const blogs = JSON.parse(data)
//         const blog = blogs.filter(blog => blog.id == id)[0]
//         const blogIdx = blogs.indexOf(blog)
//         const spliceBlog = blogs.splice(blogIdx, 1)[0]
//         blog.push(spliceBlog)
//         fs.writeFile('./data/blogs.json', JSON.stringify(blogs), (error)=>{
//             if (error) throw error
//             response.render('allblogs', { blogs: blogs })
//         })
//     })

    
// })



// app.get('/update/:id', function (request, response) {
//     // Read the data from the JSON file
//     const fs = require('fs');
//     const filename = './data/blogs.json';
//     let fileContent = fs.readFileSync(filename);
//     let content = JSON.parse(fileContent);
  
//     // Find the data to edit
//     let id = request.params.id;
//     let data = content.find(item => item.id === id);
  
//     // Render the edit page with the data to edit
//     response.render('update', { data: data });
//   });

//   app.post('/update/:id', function (request, response) {
//     // Read the data from the form
//     let id = request.params.id;
//     let title = request.body.title;
//     let description = request.body.description
  
//     // Update the JSON file
//     const fs = require('fs');
//     const filename = './data/blogs.json';
//     let fileContent = fs.readFileSync(filename);
//     let content = JSON.parse(fileContent);
//     let index = content.findIndex(item => item.id === id);
//     content[index].title = title
//     content[index].description = description
//     fs.writeFileSync(filename, JSON.stringify(content));
  
//     // Redirect back to the edit page
//     res.redirect('/update/' + id);
//   });

// app.get('/edit/:id', function (request, response) {
//     // Read the data from the JSON file
//     const fs = require('fs');
//     const filename = 'data/blogs.json';
//     let fileContent = fs.readFileSync(filename);
//     let content = JSON.parse(fileContent);
  
//     // Find the blog to edit
//     console.log(content)
//     let id = request.params.id;
//     let blog = content.find(blog => blog.id === id);
  
//     // Render the edit page with the blog to edit
//     response.render('edit', { blog: blog });
//   });

//   app.post('/update/:id', function (request, response) {
//     // Read the data from the form
//     let id = request.params.id;
//     let title = request.body.title;
//     let description = request.body.description;
  
//     // Update the JSON file
//     const fs = require('fs');
//     const filename = 'data/blogs.json';
//     let fileContent = fs.readFileSync(filename);
//     let content = JSON.parse(fileContent);
//     let index = content.findIndex(item => item.id === id);
//     content[index].title = title;
//     content[index].description = description;
//     fs.writeFileSync(filename, JSON.stringify(content));
  
//     // Redirect back to the edit page
//     response.redirect('/edit/' + id);
//   });

// app.get('/update/:id', (request, response)=>{
//     const id = request.params.id

//     fs.readFile('./data/blogs.json', (error, data)=>{
        
//     })
// })




app.get('/edit', function(request, response) {
    fs.readFile(fileName, 'utf8', (error, data) => {
      if (error) throw error;
      const json = JSON.parse(data);
      const item = json.find(item => item.id === request.params.id);
      response.render('edit', { title: 'Edit Page', item });
    });
  });
  
  app.post('/edit', function(request, response) {
    const updatedData = request.body;
  
    fs.readFile(fileName, 'utf8', (error, data) => {
      if (error) throw error;
      const json = JSON.parse(data);
      const itemIndex = json.findIndex(item => item.id === request.params.id);
      json[itemIndex] = updatedData;
  
      fs.writeFile(fileName, JSON.stringify(json), (error) => {
        if (error) throw error;
        response.redirect('/allblogs');
      });
    });
  });







app.listen(8000, error =>{
    if (error) console.log(error)

    console.log('Server is running on port 8000...')
} )

function id(){
    return '_' + Math.random().toString(36).substring(2, 9)
} 












