let mySound;
let amp;
function preload() {
  mySound = loadSound('/assets/horn.wav');
}

function setup() {

  //let cnv = createCanvas(1000, 1000);
  createCanvas(1000, 1000);
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
   }

}

/** 
function canvasPressed() {
  // playing a sound file on a user gesture
  // is equivalent to `userStartAudio()`
  mySound.play();
}
*/
