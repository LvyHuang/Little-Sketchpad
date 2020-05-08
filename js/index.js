//1.初始化数据
let canvas = document.getElementById("canvas"),
    context = canvas.getContext('2d'),
    eraser = document.getElementById("eraser"),
    eraserEnabled = false,
    brush = document.getElementById("brush"),
    clear = document.getElementById("clear"),
    download = document.getElementById("save"),
    color = document.getElementById("colors"),
    size = document.getElementById("size"),
    action = document.getElementById("actions");

//2.设置画布自动布满视口
autoCanvasSize(canvas);
//3.执行用户动作
listenToUser(canvas);

/****************************/

// brush.onclick = function () {
//     if(eraserEnabled){
//         eraserEnabled = false;
//         brush.classList.add("active");
//         eraser.classList.remove("active");
//     }
// };
// eraser.onclick = function () {
//     if(!eraserEnabled) {
//         eraserEnabled = true;
//         eraser.classList.add("active");
//         brush.classList.remove("active");
//     }
// };
// clear.onclick = function () {
//     context.clearRect(0, 0, canvas.width, canvas.height);
// };
// download.onclick = function () {
//     var url = canvas.toDataURL("image/png");
//     var a = document.createElement('a');
//     document.body.appendChild(a);
//     a.href = url;
//     a.download = '下载的图片';
//     a.target = '_blank';
//     a.click();
// }

color.addEventListener('click',(e) => {
    let selectedColor = e.target.id;
    context.strokeStyle = selectedColor;
    whichActived(selectedColor, 'color')
});
size.addEventListener('click',(e) => {
    let selectedSize = e.target.id;
    if (selectedSize === 'thin') {
        context.lineWidth = 5;
    } else if (selectedSize === 'middle') {
        context.lineWidth = 8;
    } else if (selectedSize === 'thick') {
        context.lineWidth = 11;
    }
    whichActived(selectedSize, 'size')
});
action.addEventListener('click',(e) =>{
    if (e.target.tagName === 'svg') {
        takeAction(e.target.id)
    } else if (e.target.tagName === 'use') {
        takeAction(e.target.parentElement.id)
    } else if (e.target.tagName === 'LI') {
        takeAction(e.target.children[0].id)
    }
    whichActived(e.target.parentElement.id,'action')
});

function takeAction(element) {
    if (element === 'brush') {
        if(eraserEnabled){
            eraserEnabled = false; }
    } else if (element === 'eraser') {
        if(!eraserEnabled) {
            eraserEnabled = true; }
    }else if (element === 'clear') {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }else if (element === 'save') {
        let url = canvas.toDataURL("image/png");
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = '下载的图片';
        a.target = '_blank';
        a.click();
    }
}
//连线
function drawLine(x1, y1, x2, y2) {
    context.beginPath();
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
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
    }
}

function whichActived(target, parentID) {
    let parentNode;
    if (parentID === 'color') {
        parentNode = color
    } else if (parentID === 'size') {
        parentNode = size
    } else if (parentID === 'action'){
        parentNode = action
    }
    for (let i = 0; i < parentNode.children.length; i++) {
        if (target === parentNode.children[i].id) {
            parentNode.children[i].className = "active"
        } else if (target !== parentID) {
            parentNode.children[i].className = ""
        }
    }
}

/*  用户动作  */
function listenToUser(canvas){
    context.lineWidth = 5;
    let using = false;      //是否正在使用
    let lastPoint = {x:undefined, y:undefined};
    if(document.body.ontouchstart !== undefined){       //特性检测
        canvas.ontouchstart = function (a) {            //触屏设备
            using = true;
            let x = a.touches[0].clientX;
            let y = a.touches[0].clientY;
            lastPoint = {x:x, y:y};
        };
        canvas.ontouchmove = function (a) {
            let x = a.touches[0].clientX;
            let y = a.touches[0].clientY;
            if(!using) { return }
            if(eraserEnabled){
                context.clearRect(x-8, y-8, 16, 16);
            }else{
                let newPoint = {x:x, y:y};
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
            let x = a.clientX;
            let y = a.clientY;
            lastPoint = {x:x, y:y};
        };
        canvas.onmousemove = function (a) {     //鼠标移动时
            let x = a.clientX;
            let y = a.clientY;
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
