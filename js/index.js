//1.初始化数据
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var eraser = document.getElementById("eraser");
var eraserEnabled = false;
var brush = document.getElementById("brush");
var clear = document.getElementById("clear");
var download = document.getElementById("save");

//2.设置画布自动布满视口
autoCanvasSize(canvas);
//3.执行用户动作
listenToUser(canvas);

brush.onclick = function () {
    if(eraserEnabled){
        eraserEnabled = false;
        brush.classList.add("active");
        eraser.classList.remove("active");
    }
};
eraser.onclick = function () {
    if(!eraserEnabled) {
        eraserEnabled = true;
        eraser.classList.add("active");
        brush.classList.remove("active");
    }
};
clear.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
};
download.onclick = function () {
    var url = canvas.toDataURL("image/png");
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = '下载的图片';
    a.target = '_blank';
    a.click();
}

var black = document.getElementById("black");
var red = document.getElementById("red");
var green = document.getElementById("green");
var blue = document.getElementById("blue");
black.onclick = function () {
    context.strokeStyle = "black";
    black.classList.add("active");
    red.classList.remove("active");
    green.classList.remove("active");
    blue.classList.remove("active");
};
red.onclick = function () {
    context.strokeStyle = "red";
    red.classList.add("active");
    black.classList.remove("active");
    green.classList.remove("active");
    blue.classList.remove("active");
};
green.onclick = function () {
    context.strokeStyle = "green";
    green.classList.add("active");
    red.classList.remove("active");
    blue.classList.remove("active");
    black.classList.remove("active");
};
blue.onclick = function () {
    context.strokeStyle = "blue";
    blue.classList.add("active");
    black.classList.remove("active");
    red.classList.remove("active");
    green.classList.remove("active");
};

var thin = document.getElementById("thin");
var middle = document.getElementById("middle");
var thick = document.getElementById("thick");
var lineWidth = 5;
thin.onclick = function () {
    lineWidth = 5;
    thin.classList.add("active");
    middle.classList.remove("active");
    thick.classList.remove("active");
};
middle.onclick = function () {
    lineWidth = 8;
    middle.classList.add("active");
    thin.classList.remove("active");
    thick.classList.remove("active");
};
thick.onclick = function () {
    lineWidth = 11;
    thick.classList.add("active");
    thin.classList.remove("active");
    middle.classList.remove("active");
};

//连线
function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.lineWidth = lineWidth;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}
//全屏
function autoCanvasSize(canvas) {
    setCanvasSize();
    context.strokeStyle = "black";
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

/*  用户动作  */
function listenToUser(canvas){
    var using = false;      //是否正在使用
    var lastPoint = {x:undefined, y:undefined};
    if(document.body.ontouchstart !== undefined){       //特性检测
        canvas.ontouchstart = function (a) {            //触屏设备
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
        //PC设备
        canvas.onmousedown = function (a) {     //鼠标按下时
            using = true;
            var x = a.clientX;
            var y = a.clientY;
            lastPoint = {x:x, y:y};
        };
        canvas.onmousemove = function (a) {     //鼠标移动时
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
        canvas.onmouseup = function () {        //鼠标松开时
            using = false;
        };
}
