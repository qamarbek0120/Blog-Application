const {request, response} = require('express')
const express = require('express')
const app = express()
const fs = require('fs')
const fileUpload = require('express-fileupload')




app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.use(express.urlencoded({extended: false}))
app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

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

app.post('/create', (request, response)=>{
    const title = request.body.title
    const description = request.body.description
    if (title.trim() === '' && description.trim() === ''){
        response.render('create', { error: true })
    }
    else{
        fs.readFile('./data/blogs.json', (error, data) =>{
            if (error) throw error

            const blogs = JSON.parse(data)

            blogs.push({
                id: id(),
                title: title,
                description: description,
            })
            fs.writeFile('./data/blogs.json', JSON.stringify(blogs), error=>{
                if (error) throw error

                response.render('create', { success: true })
            })
            
        })
    }
    
})

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

app.get('/:id/update', (request, response)=>{
    const id = request.params.id

    fs.readFile('./data/blogs.json', (error, data)=>{
        if (error) throw error 
        const blogs = JSON.parse(data)
        const blog = blogs.filter(blog => blog.id == id)[0]
        const blogIndex = blogs.indexOf(blog)
        const spliceBlog = blogs.splice(blogIndex, 1)[0]
        blogs.push(spliceBlog)

        fs.writeFile('./data/blogs.json', JSON.stringify(data), (error)=>{
            if (error) throw error
            response.render('detail', { blogs: blogs })
        })
    })
    
      
})






app.listen(8000, error =>{
    if (error) console.log(error)

    console.log('Server is running on port 8000...')
} )

function id(){
    return '_' + Math.random().toString(36).substring(2, 9)
}









