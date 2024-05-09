//Created by Marcus Lee in 2024

let fish, fishImage
let fishes = []
let mouseD, mouseA, mouseF
let originD, originA, originF
let repulseFX, repulseFY
let attractFX, attractFY
let forceX, forceY
let font
let b = 1
let r = 16
let s
let shark, sharkImage, sharkOpen, sharkClose, sharkMouth, sharkDirection
let sharkTrail = 0
let fishDirection
let bubbles = []

function preload() {
  font = loadFont ("font/ConcertOne-Regular.ttf")
  fishImage = loadImage("assets/fish_v002.png")
  sharkOpen = loadImage("assets/shark_open_v002.png")
  sharkClose = loadImage("assets/shark_close_v002.png")  
}

function setup() {
  createCanvas(1200, 720)
  noCursor()
  fishes = font.textToPoints("MARCUS",  155, 450, 250, {sampleFactor: 0.06, simplifyThreshold: 0})
  ellipseMode(CENTER)
  imageMode(CENTER)
  angleMode(DEGREES)
  colorMode(HSB)
  topColor = color(225, 69, 100)
  bottomColor = color(246, 69, 29)
  frameRate(30)

  //Create shark
  shark = new Shark(mouseX, mouseY)
  sharkImage = [
    sharkClose, sharkOpen
  ]

  //Generate Bubbles
  setInterval(createBubbles, 80)
}

function draw() {
 
  //ocean background
  push()
  for (let i = 0; i < 100; i++) {
    noStroke()
    fill(200, 160 - i, 0 + i)
    circle(width/2, -50, 1950 - r * i)
  }
  pop()

  //Creating Bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].show()
    bubbles[i].update()

    //deleting bubbles
    if (bubbles[i].y < 0) {
      bubbles.splice(i, 1)
    } 
  }
  
  //fish
  for (let i = 0; i < fishes.length; i++) {
    fish = new Fish(fishes[i].x, fishes[i].y)
    fish.update()
    fish.show()
  }

  //shark bubble trail
  if (pmouseX != mouseX && sharkTrail == -50 || pmouseX != mouseX && sharkTrail == 50) {
    let b2 = new Bubble(mouseX + sharkTrail, mouseY, random(4,8), 1)
    bubbles.push(b2)
  }

  //Create shark
  shark.show()
  
  //Coordinate Indicator
  // coInd()
}

class Fish {
  constructor(x, y, t) {
    //XY coord that moves with the fish
    this.x = x
    this.y = y
    //XY coord that is locked when the fish generates
    this.originX = x
    this.originY = y
  }

  show() {
    push()
    translate(random(this.x, this.x + 2.5), random( this.y, this.y + 2.5))

    //control fish direction
    if(pmouseX - mouseX < 0) {
      fishDirection = 1
    } else if (pmouseX - mouseX > 0){
      fishDirection = 0
    }

    if (fishDirection == 1){
      scale(-0.05, 0.05)
    }else {
      scale(0.05, 0.05)
    }

    //control fish rotation
    if(mouseD < 150) {
      rotate(constrain((atan2(this.originY - this.y, this.originX - this.x)), -45, 45) )
    } else {
      rotate(0)
    }
    image(fishImage, 0, 0)
    pop()
  }

  update() {
    //mouse
    mouseD = dist(this.x, this.y, mouseX, mouseY)
    mouseA = atan2(this.y- mouseY, this.x - mouseX)

    //home
    originD = dist(this.x, this.y, this.originX, this.originY)
    originA = atan2(this.originY - this.y, this.originX - this.x)

   //forces
                                 
    mouseF = constrain(map(mouseD, 0, 250, 126, 0), 0, 90)
    originF = map(originD, 0, 100, 0, 10)
      

    //X componenet

    //x component of repulsive forces
    repulseFX = mouseF * cos(mouseA)

    //x component of attractive forces
    attractFX = originF * cos(originA)

    //net force of x component
    forceX = repulseFX + attractFX
    
    //Y componenet

    //y componenet of repulsive forces
    repulseFY = mouseF * sin(mouseA)

    //y componenet of attactive forces
    attractFY = originF * sin(originA)

    //net force of y component
    forceY = repulseFY + attractFY 

    //fish animation
    this.x = this.x + forceX
    this.y = this.y + forceY

  }
}

function coInd() {
  text(mouseX + "," + mouseY, 20, 20)
  text(mouseA, 20, 50)
}

class Shark {

  show() {
    push()

    //shark mouth animation
    if(mouseX > 140 && mouseX < 1060 && mouseY > 270 && mouseY < 457) {
      sharkMouth = 1
    } else {
      sharkMouth = 0
    }

    if (mouseIsPressed && mouseX > 140 && mouseX < 1060 && mouseY > 270 && mouseY < 457){
      sharkMouth = 0
    } else if (mouseIsPressed) {
      sharkMouth = 1
    }

    translate(mouseX, mouseY)

    //control shark direction
    if(pmouseX > mouseX) {
      //left
      sharkDirection = 1

    }else if (pmouseX < mouseX) {
      //right
      sharkDirection = 0
    }

    if (sharkDirection == 1) {
      scale(0.3, 0.3)
      sharkTrail = 50
    } else {
      scale(-0.3, 0.3)
      sharkTrail = -50
    }

    //underwater effect
    tint(185, map(mouseY, 120, 700, 15, 19), map(mouseY, 120, 700, 100, 85))
  
    image(sharkImage[sharkMouth], 0, 0)

    pop()
  }
}

class Bubble {
  constructor( x, y, s, a) {
    this.x = x
    this.y = y
    this.s = s
    this.a = a
  }
 
  show() {
    push()
    noStroke()
    fill(198, map(this.y, 720, 100, 60, 20), map(this.y, 720, 100, 50, 100), this.a)
    circle(random(this.x - 10,this.x), this.y, this.s)
    pop()
  }

  update() {
    this.y += -4
  }
}

function createBubbles() {
  let b = new Bubble(random(0, 1200), 720, random(1, 20), random(0.05, 0.45))
  bubbles.push(b)
}


