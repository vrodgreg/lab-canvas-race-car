let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

// funtion ranNum(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// changes  
// more changes 


let score = 0
let pewpew = 0

let startButton = false;
document.getElementById('start-button').onclick = animate

// roadImg.onload = animate
let roadImg = new Image()
roadImg.src = "./images/road.png"
let road = {x: 0, y: 30, w: 500, h: 700, img: roadImg}

// carImg.onload = animate
let carImg = new Image()
carImg.src = "./images/car.png"

//>>>>>>>>>> CHECKS FOR LOCATION OF MOUSE <<<<<<<<
//document.getElementById('clickme').onclick = function clickEvent(e) {

document.addEventListener('mousemove', e => {
  gMouseX=e.pageX;
  gMouseY=e.pageY;
  // console.log(mX, mY);
})
let gShipAngleInRads = 0;

document.getElementById("canvas").style.cursor="url('./images/crosshair.cur'), auto"
// builds Obstacles
class Obstacle {
  constructor(x, y, w, h, color) {
  this.x = x
  this.y = y
  this.w = w
  this.h = h
  this.color = color
  }
  draw() {
    this.y += 1

//Resets to top of game board and resizes obstacles after they run off the bottom
      if (this.y > 800) {
        this.y = -100
        this.x = Math.floor(Math.random() * (400 - 1 + 1) + 1)
        this.w = Math.floor(Math.random() * (200 - 50 + 1) + 50)
        this.color = "red"
      } 

    //   >>> THIS IS WHERE I WANT TO CHECK FOR COLLISION  <<< 

    
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.w, this.h)
    
    collisionDetection(this, toyota)


    //this is where I check forst to see if there is an active pewpew on the screen and if so, then if it has hit an obstacle.
    if (pewpew !== 0) {
      pewpewDetection(this)
    }
  
    // if there is an active bullet then I want to check if it has collided with an obstacle by calling pewpewDetection

    // call pewpewDetection and I'm going to pass 'this' as the only parameter and then I'm going to change what would have been the second paramter to the x & y for the bullet which is pew.x and pew.y
  }
}

//Initalizes 4 obstacles for start of game
let obstacle1 = new Obstacle (200, 100, 250, 10, "#FF0000")
let obstacle2 = new Obstacle (25, 300, 125, 10, "blue")
let obstacle3 = new Obstacle (25, 500, 250, 10, "green")
let obstacle4 = new Obstacle (150, 700, 125, 10, "yellow")

function collisionDetection(rect1, rect2) {
  if (rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.y + rect1.h > rect2.y &&
    rect1.color != "white") {
      // collision detected!
      document.getElementById("gameOver").innerHTML = "You have now lost your <br> State Farm Safe Driver Discount. <br>GAME OVER"
      
      cancelAnimationFrame(interval)
    }
}

//builds cars
class Car {
  constructor(x, y, w, h, img) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.img = img
  }

  draw() {
    //>>>>> THIS IS THE CODE TO ROTATE THE CAR <<<<<

    //>>>>>This code gets the coord of the canvas    
    let canvasXY = canvas.getBoundingClientRect()

    //>>>>>This code adjusts the coord of the mouse on the page as it relates to the canvas
    let actualMouseX = gMouseX - canvasXY.x
    let actualMouseY = gMouseY - canvasXY.y

    //>>>>>>this code calculates the radian for the angle as the mouse location rates to the center of the ship which is the origin 
    gShipAngleInRads = Math.atan2(actualMouseY-this.y, actualMouseX-this.x)
    
    //>>>>>>>This rotates the canvas by the calculated radian + 90 degrees
    ctx.rotate(gShipAngleInRads + 90 * Math.PI/180)
    ctx.translate(-250, -350)  //This moves the 0,0 origin of the canvas to the center of the ship/car

    //>>>>>Draws image on rotated canvas
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h)

    //>>>>>>>returns canvas to prior un-rotated state
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    //console.log(gMouseX, gMouseY, gShipAngleInRads, this.x, this.y);
 
  }
}

//initializes car for start of game
let toyota = new Car(225, 300, 50, 100, carImg) 

// listens for arrow key presses
window.onkeydown = function(e) {
  // console.log(e.key)
    switch (e.key) {    
      case "ArrowLeft":
        if (toyota.x >= 30) {
        toyota.x -= 30;
        }
       break;
      case "ArrowRight":
       if (toyota.x <= road.w-toyota.w-11) {
        toyota.x += 30;
       }
        break
      case "ArrowUp":
        if (toyota.y >= 30) {
          toyota.y -= 30;
      }
       break;
      case "ArrowDown":
        if (toyota.y <= road.h-toyota.h-30) {
      toyota.y += 30;
        }
        break;
      case "p":
        //alert(pewpew);
        pewpew = 1;
        pewx = toyota.x+22;
        pewy = toyota.y-3;
        break; 
    }
}

function pewpewDetection(rect1) {
  if (rect1.x < pewx + 6 &&
    rect1.x + rect1.w > pewx &&
    rect1.y < pewy + 6 &&
    rect1.y + rect1.h > pewy &&
    rect1.color != "white") {
      //alert("bullet hit obstacle")
      // collision detected!
      // rect1.x = 0
      // rect1.y = 0
      // rect1.h = 0
      // rect1.w = 0
      rect1.color = "white"
      pewpew = 0

    }
}

function pewpewpew () {
  if (pewpew == 1) {
    // console.log(pewy)
    ctx.fillStyle = "black"
    ctx.fillRect(pewx, pewy, 6, 6)
    //pewpewDetection()
    pewy--
    if (pewy <= -10) {
      pewpew = 0;
    }
  }
}

let interval = null




//Game engine - constantly looping
function animate() {
  interval = requestAnimationFrame(animate)
  // console.log("animate")
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.drawImage(roadImg, road.x, road.y, road.w, road.h) 

  ctx.translate(250, 350)

  toyota.draw()
  
  obstacle1.draw()
  obstacle2.draw()
  obstacle3.draw()
  obstacle4.draw()
  // var yy = MouseEvent.screenY
  // var xx = MouseEvent.screenX
  // console.log(MouseEvent.screenX)
  // console.log(MouseEvent.screenY)

  pewpewpew()

  score++
  document.getElementById("score").innerHTML = score

}



