let mySound;
let amp;
let mouseGrid_Res = 2;
let mouseGridX = [];
let mouseGridY = [];

function preload() {
  mySound = loadSound('assets/horn.wav');
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  for(let i = 0 ; i < windowWidth ; i+=windowWidth/mouseGrid_Res){
    mouseGridX.push(i);
  }
  for(let i = 0 ; i < windowHeight ; i+=windowHeight/mouseGrid_Res){
    mouseGridY.push(i);
  }
  //print("mouseGridX[1] = " + mouseGridX[1]);
  //print("mouseGridY = " + mouseGridY);
  colorMode(HSB,360,100,100,100);
  rectMode(CENTER);
  background(220);
  text('tap here to play', 10, 20);
  
  amp = new p5.Amplitude();
  amp.setInput(mySound);
}

function draw(){
  print("amp.getLevel() = " + amp.getLevel());
  background(0,100,0);

  if(mySound.isPlaying()){
     //for(int i = 0 ; i<)
     push();
     translate(width/2,height/2);
     rotate((mySound.currentTime()*2));
     scale(amp.getLevel()*10);
     fill(0,100,100);
     square(0,0,200)
     pop();
   }

   //if(keyIsDown && key == 'a'){
   if(keyIsPressed && key == 'a'){
        if (mySound.isPlaying() == false) {
            mySound.play();
        }
   }

   if(mouseIsPressed){  
    print(mouseX + " , " + mouseY);
    // Vérifier si le clic est dans la case en haut à gauche
    if(mouseX >= 0 && mouseX < mouseGridX[1] && mouseY >= 0 && mouseY < mouseGridY[1]){
      if (mySound.isPlaying() == false) {
        mySound.play();
      }
    }
   }

     
  // Dessiner la grille
  stroke(255);
  strokeWeight(1);
  for(let x of mouseGridX) {
    line(x, 0, x, height);
  }
  for(let y of mouseGridY) {
    line(0, y, width, y);
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



/** 
function canvasPressed() {
  // playing a sound file on a user gesture
  // is equivalent to `userStartAudio()`
  mySound.play();
}
*/
