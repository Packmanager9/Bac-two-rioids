
window.addEventListener('DOMContentLoaded', (event) =>{


    
    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        console.log(bacteria.length)
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];
      });

    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

    tutorial_canvas.style.background = "#000000"

    class Triangle{
        constructor(x, y, color, length){
            this.x = x
            this.y = y
            this.color= color
            this.length = length
            this.x1 = this.x + this.length
            this.x2 = this.x - this.length
            this.tip = this.y - this.length*2
            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
            this.accept2 = (this.y-this.tip)/(this.x2-this.x)

        }

        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.stokeWidth = 3
            tutorial_canvas_context.moveTo(this.x, this.y)
            tutorial_canvas_context.lineTo(this.x1, this.y)
            tutorial_canvas_context.lineTo(this.x, this.tip)
            tutorial_canvas_context.lineTo(this.x2, this.y)
            tutorial_canvas_context.lineTo(this.x, this.y)
            tutorial_canvas_context.stroke()
        }

        isPointInside(point){
            if(point.x <= this.x1){
                if(point.y >= this.tip){
                    if(point.y <= this.y){
                        if(point.x >= this.x2){
                            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
                            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
                            this.basey = point.y-this.tip
                            this.basex = point.x - this.x
                            if(this.basex == 0){
                                return true
                            }
                            this.slope = this.basey/this.basex
                            if(this.slope >= this.accept1){
                                return true
                            }else if(this.slope <= this.accept2){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }


    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
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
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
        //    tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            if(this.x < 0){
                this.x = this.x+tutorial_canvas.width
            }
            if(this.y < 0){
                this.y = this.y+tutorial_canvas.height
            }
            if(this.x > tutorial_canvas.width){
                this.x =  (this.x-tutorial_canvas.width)
            }
            if(this.y > tutorial_canvas.height){
                this.y =  (this.y-tutorial_canvas.height)
            }
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
            if(this.xrepel+this.x < tutorial_canvas.width && this.x+this.xrepel > 0){
                this.x+=this.xrepel
                this.xrepel = 0
            }
            if(this.yrepel+this.y < tutorial_canvas.height && this.y+this.yrepel > 0){
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

    class Observer{
        constructor(){
            this.body = new Circle( 500, 500, 5, "white")
            this.ray = []
            this.rayrange = 220
            this.globalangle = Math.PI
            this.gapangle = Math.PI/8
            this.currentangle = 0
            this.obstacles = []
            this.raymake = 40
        }

        beam(){
            this.currentangle  = this.gapangle/2
            for(let k = 0; k<this.raymake; k++){
                this.currentangle+=(this.gapangle/Math.ceil(this.raymake/2))
                let ray = new Circle(this.body.x, this.body.y, 1, "white",((this.rayrange * (Math.cos(this.globalangle+this.currentangle))))/this.rayrange*2, ((this.rayrange * (Math.sin(this.globalangle+this.currentangle))))/this.rayrange*2 )
                ray.collided = 0
                ray.lifespan = this.rayrange-1
                this.ray.push(ray)
            }
            for(let f = 3; f<this.rayrange/2; f++){
                for(let t = 0; t<this.ray.length; t++){
                    if(this.ray[t].collided < 1){
                        this.ray[t].move()
                    for(let q = 0; q<this.obstacles.length; q++){
                        if(this.obstacles[q].isPointInside(this.ray[t])){
                            this.ray[t].collided = 1
                        }
                      }
                    }
                }
            }
        }

        draw(){
            this.beam()
            this.body.draw()
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.fillStyle = "red"
            tutorial_canvas_context.strokeStyle = "red"
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.body.x, this.body.y)
            for(let y = 0; y<this.ray.length; y++){
                    tutorial_canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                        tutorial_canvas_context.lineTo(this.body.x, this.body.y)
                }
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.fill()
            this.ray =[]
        }

        control(){
            if(keysPressed['t']){
                this.globalangle += .05
            }
            if(keysPressed['r']){
                this.globalangle -= .05
            }
            if(keysPressed['w']){
                this.body.y-=2
            }
            if(keysPressed['d']){
                this.body.x+=2
            }
            if(keysPressed['s']){
                this.body.y+=2
            }
            if(keysPressed['a']){
                this.body.x-=2
            }
        }
    }

    class Shape{
        constructor(){
            this.circle = new Circle(360,350, 50, "red")
            this.circle2 = new Circle(320,350, 30, "red")
            this.circle3  = new Circle(400,350, 30, "red")
            this.rectangle = new Rectangle(300,140, 110, 110, "red")
            this.rectangle = new Rectangle(300,140, 110, 110, "red")
            this.triangle2 = new Triangle(340,350, "red", 40)
            this.triangle1 = new Triangle(380,350, "red", 50)
            this.triangle1.x2+=40
            this.triangle2.tip-=20

        }
        isPointInside(point){
            if(this.circle.isPointInside(point)){
                if(!this.circle2.isPointInside(point)){
                    // return true
                // if(this.rectangle.isPointInside(point)){
                    if(!this.circle3.isPointInside(point)){
                        return true
                    }
                // }
            }
        }
            return false
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
                        }else  if(this.type == 3 && this.obstacles[k].type == 0){
                            this.marked = 1
                        }else   if(this.type == 4 && this.obstacles[k].type == 0){
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
        // if(Math.random()<.01){
        //     console.log(this.obstacles.length, bacteria.length)
        // }
    }
            // for(let t = 0;t<bacteria.length;t++){
            //     if(this.body != bacteria[t].body){

            //         if(this.body.repelCheck(bacteria[t].body)){
            //             let distance = ((new Line(this.body.x, this.body.y, bacteria[t].body.x, bacteria[t].body.y, 1, "red")).hypotenuse())-(this.body.radius+bacteria[t].body.radius)
            //             let angleRadians = Math.atan2(this.body.y - bacteria[t].body.y, this.body.x - bacteria[t].body.x);
    
            //                 this.body.xrepel -= (Math.cos(angleRadians)*distance)*.9
            //                 this.body.yrepel -= (Math.sin(angleRadians)*distance)*.9

            //                 if(bacteria[t].type == 0 && this.type == 1){
            //                     this.marked = 1
            //                 }

            //                 if(bacteria[t].type == 0 && this.type == 2){
            //                     this.marked = 1
            //                 }

            //                 if(bacteria[t].type == 1 && this.type == 2){
            //                     this.marked = 1
            //                 }
            //                 if(bacteria[t].type == 1 && this.type == 3){
            //                     this.marked = 1
            //                 }

            //                 if(bacteria[t].type == 2 && this.type == 3){
            //                     this.marked = 1
            //                 }
            //                 if(bacteria[t].type == 2 && this.type == 4){
            //                     this.marked = 1
            //                 }

            //                 if(bacteria[t].type == 3 && this.type == 4){
            //                     this.marked = 1
            //                 }
            //                 if(bacteria[t].type == 3 && this.type == 0){
            //                     this.marked = 1
            //                 }

            //                 if(bacteria[t].type == 4 && this.type == 0){
            //                     this.marked = 1
            //                 }
            //                 if(bacteria[t].type == 4 && this.type == 1){
            //                     this.marked = 1
            //                 }
            //         }

            //     }
            // }
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
        
        
        // if(counter%10 == 0){
        //     for(let t = 0;t<bacteria.length;t++){
        //         for(let k = 0;k<bacteria.length;k++){
        //         if(t!=k){
        //             let distance = ((new Line(bacteria[k].body.x, bacteria[k].body.y, bacteria[t].body.x, bacteria[t].body.y, 1, "red")).hypotenuse())-(bacteria[k].body.radius+bacteria[t].body.radius)
        //             if(distance <= (bacteria[k].body.radius+bacteria[t].body.radius)*2){
        //             if(bacteria[k].body.repelCheck(bacteria[t].body)){
        //                 let angleRadians = Math.atan2(bacteria[k].body.y - bacteria[t].body.y, bacteria[k].body.x - bacteria[t].body.x);
    
        //                     bacteria[k].body.xrepel -= (Math.cos(angleRadians)*distance)*1
        //                     bacteria[k].body.yrepel -= (Math.sin(angleRadians)*distance)*1
                  
    
        //                     if(bacteria[t].type == 0 && bacteria[k].type == 1){
        //                         bacteria[k].marked = 1
        //                     }else if(bacteria[t].type == 0 && bacteria[k].type == 2){
        //                         bacteria[k].marked = 1
        //                     }else if(bacteria[t].type == 1 && bacteria[k].type == 2){
        //                         bacteria[k].marked = 1
        //                     }else if(bacteria[t].type == 1 && bacteria[k].type == 3){
        //                         bacteria[k].marked = 1
        //                     }else if(bacteria[t].type == 2 && bacteria[k].type == 3){
        //                         bacteria[k].marked = 1
        //                     }else if(bacteria[t].type == 2 && bacteria[k].type == 4){
        //                         bacteria[k].marked = 1
        //                     }else if(bacteria[t].type == 3 && bacteria[k].type == 4){
        //                         bacteria[k].marked = 1
        //                     }else  if(bacteria[t].type == 3 && bacteria[k].type == 0){
        //                         bacteria[k].marked = 1
        //                     }else   if(bacteria[t].type == 4 && bacteria[k].type == 0){
        //                         bacteria[k].marked = 1
        //                     }else if(bacteria[t].type == 4 && bacteria[k].type == 1){
        //                         bacteria[k].marked = 1
        //                     }else{
        //                         for(let j =0;j<5;j++){

        //                             bacteria[k].counter-=1
        //                             if(bacteria[k].counter%bacteria[k].reproduciontimer == 0){
        //                                 bacteria[k].counter++
        //                             }
            
        //                             bacteria[t].counter-=1
        //                             if(bacteria[t].counter%bacteria[t].reproduciontimer == 0){
        //                                 bacteria[t].counter++
        //                             }
        //                         }
        //                     }
        //             }
        //         }
        //         }
        //         }
        //     }
    

        // }


        for(let t = 0;t<bacteria.length;t++){
            bacteria[t].draw()
        }
        for(let t = 0;t<bacteria.length;t++){
            bacteria[t].clean()
        }
    }, 1) 



        
})