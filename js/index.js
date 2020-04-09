var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var eraser = document.getElementById("eraser");
var eraserEnabled = false;
var brush = document.getElementById("brush");
var actions = document.getElementById("actions");

autoCanvasSize(canvas);
listenToUser(canvas);

brush.onclick = function () {
    if(eraserEnabled){
        eraserEnabled = false;
        actions.className = "actions";
    }
};
eraser.onclick = function () {
    if(!eraserEnabled) {
        eraserEnabled = true;
        actions.className = "actions x";
    }
};

//连线
function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = "red";
    context.lineWidth = 5;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}
//全屏
function autoCanvasSize(canvas) {
    setCanvasSize();
    window.onresize = function(){
        setCanvasSize();
    };
    function setCanvasSize() {
        var pageWidth = document.documentElement.clientWidth;
        var pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
}


function listenToUser(canvas){
    var using = false;
    var lastPoint = {x:undefined, y:undefined};
    if(document.body.ontouchstart !== undefined){
        canvas.ontouchstart = function (a) {
            using = true;
            var x = a.touches[0].clientX;
            var y = a.touches[0].clientY;
            lastPoint = {x:x, y:y};
        };
        canvas.ontouchmove = function (a) {
            var x = a.touches[0].clientX;
            var y = a.touches[0].clientY;
            if(!using) { return }
            if(eraserEnabled){
                context.clearRect(x-8, y-8, 16, 16);
            }else{
                var newPoint = {x:x, y:y};
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        };
        canvas.ontouchend = function (a) {
            using = false;
        };
    }
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
            if(!using) {return}
            if(eraserEnabled){
                context.clearRect(x-8, y-8, 16, 16);
            }else{
                var newPoint = {x:x, y:y};
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        };
        //鼠标松开时
        canvas.onmouseup = function () {
            using = false;
        };

}
