const { request, response } = require('express')
const express = require('express')
const app = express()



app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.use(express.urlencoded({extended: false}))

app.get('/', (request, response)=>{
    response.render('home')
})
app.get('/allblogs/detail', (request, response)=>{
    response.render('detail') 
})

app.post('/create', (request, response)=>{
    const title = request.body.title
    const description = request.body.description
    if (title.trim() === '' && description.trim() === ''){
        response.render('create', { error: true })
    }
})

app.get('/allblogs', (request, response)=>{
    response.render('allblogs', { blogs: blogs })
})



const blogs = ["Some awasome description1", "some awaswome description2"]


app.listen(8000, error =>{
    if (error) console.log(error)

    console.log('Server is running on port 8000...')
} )






