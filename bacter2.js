window.addEventListener('DOMContentLoaded', (event) =>{
    
    document.addEventListener('keydown', (event) => {
        console.log(bacteria.length)
     });
    
    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

    tutorial_canvas.style.background = "#000000"

    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){
            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.lens = 0
            this.xrepel = 0
            this.yrepel = 0
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius-1, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
        //    tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius*this.radius)){
                return true
            }
            return false
        }
        repel(){
            if(this.xrepel+this.x+this.radius < tutorial_canvas.width && this.x+this.xrepel-this.radius > 0){
                this.x+=this.xrepel
                this.xrepel = 0
            }
            if(this.yrepel+this.y+this.radius < tutorial_canvas.height && this.y+this.yrepel-this.radius > 0){
                this.y+=this.yrepel
                this.yrepel = 0
            }
        }
        repelCheck(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius+point.radius)*(point.radius+this.radius)){
                return true
            }
            return false
        }
    }
    
    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse(){
            let xdif = this.x1-this.x2
            let ydif = this.y1-this.y2
            let hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.lineWidth = this.width
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.x1, this.y1)         
            tutorial_canvas_context.lineTo(this.x2, this.y2)
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.lineWidth = 1
        }
    }

    class Bacteria{
        constructor(x,y){
            this.marked = 0
            this.type = Math.floor(Math.random()*5)
            if(this.type == 0){
                this.body = new Circle(x,y, 1, "blue" )
            }
            if(this.type == 1){
                this.body = new Circle(x,y, 3, "yellow")
            }
            if(this.type == 2){
                this.body = new Circle(x,y, 9, "green" )
            }
            if(this.type == 3){
                this.body = new Circle(x,y,27, "red" )
            }
            if(this.type == 4){
                this.body = new Circle(x,y, 81, "white" )
            }
            this.counterx = 0
            this.body.radius = 4+(Math.random()*8) 
            this.body.radius = 3
            this.reproduciontimer = 100
            this.counter = Math.floor(Math.random()*100)
            this.obstacles = []
            for(let k = 0;k<bacteria.length;k++){
                if(this.body != bacteria[k].body){
                    let distance = ((new Line(bacteria[k].body.x, bacteria[k].body.y, this.body.x, this.body.y, 1, "red")).hypotenuse())-(bacteria[k].body.radius+this.body.radius)
                    if(distance < 250){
                        this.obstacles.push(bacteria[k])
                    }
                }
            }
        }
        draw(){
            this.counterx++

            if(this.counterx%10 == 0){
                for(let k = 0;k<this.obstacles.length;k++){
                    let distance = ((new Line(this.obstacles[k].body.x, this.obstacles[k].body.y, this.body.x, this.body.y, 1, "red")).hypotenuse())-(this.obstacles[k].body.radius+this.body.radius)
                    if(distance < 10){      
                        if(this.obstacles[k].body.repelCheck(this.body)){
                        let angleRadians = Math.atan2(this.obstacles[k].body.y - this.body.y, this.obstacles[k].body.x - this.body.x);
    
                        this.obstacles[k].body.xrepel -= (Math.cos(angleRadians)*distance)*1
                        this.obstacles[k].body.yrepel -= (Math.sin(angleRadians)*distance)*1
                        // this.obstacles[k].body,draw()

                        if(this.type == 0 && this.obstacles[k].type == 1){
                            this.marked = 1
                        }else if(this.type == 0 && this.obstacles[k].type == 2){
                            this.marked = 1
                        }else if(this.type == 1 && this.obstacles[k].type == 2){
                            this.marked = 1
                        }else if(this.type == 1 && this.obstacles[k].type == 3){
                            this.marked = 1
                        }else if(this.type == 2 && this.obstacles[k].type == 3){
                            this.marked = 1
                        }else if(this.type == 2 && this.obstacles[k].type == 4){
                            this.marked = 1
                        }else if(this.type == 3 && this.obstacles[k].type == 4){
                            this.marked = 1
                        }else if(this.type == 3 && this.obstacles[k].type == 0){
                            this.marked = 1
                        }else if(this.type == 4 && this.obstacles[k].type == 0){
                            this.marked = 1
                        }else if(this.type == 4 && this.obstacles[k].type == 1){
                            this.marked = 1
                        }else{
                            for(let j =0;j<5;j++){

                                this.obstacles[k].counter-=1
                                if(this.obstacles[k].counter%this.obstacles[k].reproduciontimer == 0){
                                    this.obstacles[k].counter++
                                }
        
                                this.counter-=1
                                if(this.counter%this.reproduciontimer == 0){
                                    this.counter++
                                }
                            }
                        }

                    }
                }
            }
        }

        if(this.counterx%100 == 0){
        this.obstacles = []
        for(let k = 0;k<bacteria.length;k++){
            if(this.body != bacteria[k].body){
                let distance = ((new Line(bacteria[k].body.x, bacteria[k].body.y, this.body.x, this.body.y, 1, "red")).hypotenuse())-(bacteria[k].body.radius+this.body.radius)
                if(distance < 10){
                    this.obstacles.push(bacteria[k])
                }
            }
        }
    }
        
            this.body.x+=(Math.random()-.5)
            this.body.y+=(Math.random()-.5)

            this.body.repel()
            this.body.move()

            this.body.draw()
        }
        clean(){
            if(this.marked == 1){
                this.obstacles = []
                bacteria.splice(bacteria.indexOf(this), 1)
            }
        }
        reproduce(){
            this.counter++
            if(this.counter%this.reproduciontimer == 0){
                
                let bacter = new Bacteria(this.body.x+(Math.random()-.5), this.body.y+(Math.random()-.5))
                bacter.type = this.type        
                bacter.body.color = this.body.color
                bacter.body.radius = this.body.radius
                bacteriax.push(bacter)
            }
        }
    }

    let bacteria = []
    let bacteriax = []

    for(let t  = 0; t<100;t++){
        let bacter = new Bacteria(Math.random()*tutorial_canvas.width, Math.random()*tutorial_canvas.height)
        bacteria.push(bacter)
    }
    
    let counter = 0
    
    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(0,0,tutorial_canvas.width, tutorial_canvas.height)
        for(let t = 0;t<bacteria.length;t++){
            bacteria[t].reproduce()
        }
        bacteria = [...bacteria, ...bacteriax]
        bacteriax = []
        tutorial_canvas_context.clearRect(0,0,tutorial_canvas.width, tutorial_canvas.height)
        counter++
        for(let t = 0;t<bacteria.length;t++){
            bacteria[t].draw()
        }
        for(let t = 0;t<bacteria.length;t++){
            bacteria[t].clean()
        }
    }, 1) 



        
})
