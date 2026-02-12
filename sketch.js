let mySound;
let amp;
let mouseGrid_Res = 3;
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
  mouseGridX.push(windowWidth);
  mouseGridY.push(windowHeight);
  //print("mouseGridX[1] = " + mouseGridX[1]);
  //print("mouseGridY = " + mouseGridY);
  colorMode(HSB,360,100,100,100);
  rectMode(CENTER);
  background(220);
  text('tap here to play', 10, 20);
  
  amp = new p5.Amplitude();
  amp.setInput(mySound);
}

// Retourne le numéro de la case cliquée (0 = première case en haut à gauche)
function getGridCell(mx, my) {
  let cellX = -1;
  let cellY = -1;
  
  for(let i = 0; i < mouseGridX.length - 1; i++) {
    if(mx >= mouseGridX[i] && mx < mouseGridX[i + 1]) {
      cellX = i;
      break;
    }
  }
  
  for(let i = 0; i < mouseGridY.length - 1; i++) {
    if(my >= mouseGridY[i] && my < mouseGridY[i + 1]) {
      cellY = i;
      break;
    }
  }
  
  if(cellX === -1) cellX = mouseGridX.length - 1;
  if(cellY === -1) cellY = mouseGridY.length - 1;
  
  return { x: cellX, y: cellY, id: cellY * mouseGrid_Res + cellX };
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
    let cell = getGridCell(mouseX, mouseY);
    print("Case: " + cell.id + " (x:" + cell.x + ", y:" + cell.y + ")");
    
    if(cell.id === 0 && !mySound.isPlaying()) {
      mySound.play();
    }
    if(cell.id === 1 && !mySound.isPlaying()) {
      mySound.play();
    }
    if(cell.id === 2 && !mySound.isPlaying()) {
      mySound.play();
    }
    if(cell.id === 3 && !mySound.isPlaying()) {
      mySound.play();
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
  
  // Afficher les numéros de case
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  for(let y = 0; y < mouseGrid_Res; y++) {
    for(let x = 0; x < mouseGrid_Res; x++) {
      let cellId = y * mouseGrid_Res + x;
      let cellCenterX = mouseGridX[x] + (mouseGridX[x + 1] - mouseGridX[x]) / 2;
      let cellCenterY = mouseGridY[y] + (mouseGridY[y + 1] - mouseGridY[y]) / 2;
      text(cellId, cellCenterX, cellCenterY);
    }
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
