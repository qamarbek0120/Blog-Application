var  images = [
    'images/img1.jpg',
    'images/img2.jpg',
    'images/img3.jpg',
    'images/img4.jpg',
    'images/img5.jpg',
    'images/img6.jpg'
]

var img = document.getElementById("blog-image")
function mgDisp(num){
    var num = Math.floor(Math.random()* 6)
    img.style.backgroundImage = `url("' + images[num + '"])`
    img.style.backgroundImage = "no-repeat"
}
mgDisp()