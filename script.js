let canvas = document.querySelector("canvas");
let paint = canvas.getContext("2d");
let picture = document.querySelector("#picture");
let eraser = document.querySelector("#eraser");
let remove = document.querySelector("#remove");
let text = document.querySelector("#text");
let downloads = document.querySelector("#downloads");
let paintbrush = document.querySelector("#paintbrush");
let paintpalette = document.querySelector("#paintpalette");
let pictures = document.querySelector(".pictures");
let gallery = document.querySelectorAll(".pictures img");
let isDrawing = false
let color = "#00000000"
let currentTool = "pen"
let size = 5 

let draggedImage = null;


function openPictures(){
    pictures.style.display = "block";
}
picture.addEventListener("click", openPictures);


gallery.forEach(function (img) {
   
    img.addEventListener("click", function () {
        paint.drawImage(img, 0, 0, 100, 100); 
        pictures.style.display = "none";
    });

    
    img.addEventListener("dragstart", function () {
        draggedImage = img;
    });
});



canvas.addEventListener("dragover", function (event) {
    event.preventDefault(); 
});


canvas.addEventListener("drop", function (event) {
    event.preventDefault(); 
    
    if (draggedImage) {
        
        let rect = canvas.getBoundingClientRect();
        
        
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        
        let stickerWidth = 120;
        let stickerHeight = 120;
        
       
        paint.drawImage(
            draggedImage, 
            x - stickerWidth / 2, 
            y - stickerHeight / 2, 
            stickerWidth, 
            stickerHeight
        );
        
        
        draggedImage = null;
        pictures.style.display = "none";
    }
});
paintpalette.addEventListener("change", function(){
    color=this.value
    paint.strokeStyle=color
})
// начало рисования
canvas.addEventListener("mousedown", function (event) {
    if (currentTool === "fill") {
        paint.fillStyle = color;
        paint.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }

    isDrawing = true;
    paint.beginPath();
    paint.moveTo(event.offsetX, event.offsetY);
});

// рисуем
canvas.addEventListener("mousemove", function (event) {
    if (isDrawing) {
        paint.lineTo(event.offsetX, event.offsetY);
        paint.stroke();
    }
});

// конец
canvas.addEventListener("mouseup", function () {
    isDrawing = false;
});

// карандаш
document.getElementById("paintbrush").addEventListener("click", function () {
    currentTool = "pen";
    paint.globalCompositeOperation = "source-over";
    paint.strokeStyle = color;
    paint.lineWidth = size;
});
eraser.addEventListener("click", function(){
    currentTool = "eraser"
    paint.globalCompositeOperation = "destination-out";
    paint.lineWidth = 20
})
remove.addEventListener("click",function(){
    paint.clearRect(0,0,canvas.width,canvas.height)
})

text.addEventListener("click", function() {
    currentTool = "text";
    
    // Создаем контейнер для текста
    let textBox = document.createElement("div");
    textBox.className = "canvas-text-box";
    
    // Создаем само поле ввода
    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Введите текст...";
    input.style.color = color; 
    
    
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-text-btn";
    deleteBtn.innerText = "×";
    deleteBtn.addEventListener("click", function() {
        textBox.remove();
    });

    textBox.appendChild(input);
    textBox.appendChild(deleteBtn);
    
    
    document.querySelector("main").appendChild(textBox);

    
    input.addEventListener("input", function() {
        this.style.width = Math.max(160, this.value.length * 13) + "px";
    });

    
    textBox.addEventListener("mousedown", function(e) {
        // Если кликнули на инпут или кнопку удаления, не двигаем блок
        if (e.target === input || e.target === deleteBtn) return; 

        
        textBox.style.transform = "none";

        let rect = textBox.getBoundingClientRect();
        let mainRect = document.querySelector("main").getBoundingClientRect();
        
        let shiftX = e.clientX - rect.left;
        let shiftY = e.clientY - rect.top;

        function moveAt(clientX, clientY) {
            let newLeft = clientX - mainRect.left - shiftX;
            let newTop = clientY - mainRect.top - shiftY;
            
            textBox.style.left = newLeft + "px";
            textBox.style.top = newTop + "px";
        }

        moveAt(e.clientX, e.clientY);

        function onMouseMove(event) {
            moveAt(event.clientX, event.clientY);
        }

        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener("mouseup", function() {
            document.removeEventListener("mousemove", onMouseMove);
        }, { once: true });
    });
});


downloads.addEventListener("click", function(){
    let link =document.createElement("a")
    link.download="drawing.png"
    link.href=canvas.toDataURL()
    link.click();
}
    
)