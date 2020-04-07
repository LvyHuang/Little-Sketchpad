var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var using = false;
var lastPoint = {x:undefined, y:undefined};
var eraser = document.getElementById("eraser");
var eraserEnabled = false;
getViewport();

window.onresize = function(){
    getViewport();
};
//鼠标按下时
canvas.onmousedown = function (a) {
    using = true;
    var x = a.clientX;
    var y = a.clientY;
    lastPoint = {x:x, y:y};
};
//鼠标移动时
canvas.onmousemove = function (a) {
    var x = a.clientX;
    var y = a.clientY;
    if(eraserEnabled){
        if(using){
            context.clearRect(x-5, y-5, 10, 10);
        }
    }else{
        if(using){
            var newPoint = {x:x, y:y};
            drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
            lastPoint = newPoint;
        }
    }

};
//鼠标松开时
canvas.onmouseup = function () {
    using = false;
};
eraser.onclick = function () {
    eraserEnabled = !eraserEnabled;
    eraser.style.background = eraserEnabled ? 'white':'#ccc';
};
function getViewport() {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
}
//画圈
function drawCircle(x, y) {
    context.beginPath();
    context.fillStyle = "red";
    context.arc(x, y, 1, 0, 2 * Math.PI);
    context.fill();
}
//连线
function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "red";
    context.lineWidth = 5;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}