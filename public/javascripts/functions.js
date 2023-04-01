var  images = [
    '/static/images/img1.jpg',
    '/static/images/img2.jpg',
    '/static/images/img3.jpg',
    '/static/images/img4.jpg',
    '/static/images/img5.jpg',
    '/static/images/img6.jpg'
]

var img = document.getElementsByClassName("blog-image")
function mgDisp(num){
    var num = Math.floor(Math.random()* 6)
    img.style.backgroundImage = `url("' + images[num + '"])`
    img.style.backgroundImage = "no-repeat"
}
mgDisp()