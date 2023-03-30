const {request, response} = require('express')
const express = require('express')
const app = express()
const fs = require('fs')




app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.use(express.urlencoded({extended: false}))

app.get('/', (request, response)=>{
    response.render('home')
})
app.get('/allblogs/detail', (request, response)=>{
    response.render('detail') 
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

app.get('/allblogs', (request, response)=>{
    fs.readFile('./data/blogs.json', (error, data)=>{
        if (error) throw error
        const blogs = JSON.parse(data)
        response.render('allblogs', { blogs: blogs })
    })
})


app.listen(8000, error =>{
    if (error) console.log(error)

    console.log('Server is running on port 8000...')
} )

function id(){
    return '_' + Math.random().toString(36).substring(2, 9)
}






