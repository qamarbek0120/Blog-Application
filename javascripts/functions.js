var  imgages = [
    'public/img1.jpg',
    'public/img2.jpg',
    'public/img3.jpg',
    'public/img4.jpg',
    'public/img5.jpg',
    'public/img6.jpg'
]

var img = document.getElementsByClassName("blog-image")
function mgDisp(num){
    var num = Math.floor(Math.random()* 6)
    img.style.backgroundImage = `url("' + images[num + '"])`
    img.style.backgroundImage = "no-repeat"
}
mgDisp()