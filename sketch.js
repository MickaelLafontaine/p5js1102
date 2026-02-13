let smoothingFactor = 0.2;// pour lisser les valeurs d'amplitude (0 = pas de lissage, 1 = lissage total)
let disque_dia = 0;// diamètre du disque qui tourne quand audio[0] est joué
let rect_apparition = 0;// largeur du rectangle qui grandit quand audio[5] est joué
let marge = 100;
let audio = [];
let amp = [];
let amp_smooth = [];
let mouseGrid_Res = 3;
let mouseGridX = [];
let mouseGridY = []; 
let infoON = false;// pour dessiner la grille d'interaction (smartphone)
let univers1 = true;// pour basculer entre les univers 1 et 2 (touche espace)
let universeCheckbox; // checkbox pour basculer les univers

// ghost trail oscillation (audio2)
let osc_num = 60;// longueur du ghost trail
let osc_x = [];
let osc_y = [];

function preload() {
    // on charge les fichiers audio - changé en MP3 pour meilleure compatibilité mobile
  audio[0] = loadSound('assets/audio1.mp3');
  audio[1] = loadSound('assets/audio3.mp3');
  audio[2] = loadSound('assets/audio4.mp3');
  audio[3] = loadSound('assets/audio6.mp3');
  audio[4] = loadSound('assets/audio11.mp3');
  audio[5] = loadSound('assets/audio12.mp3');
  audio[6] = loadSound('assets/audio23.mp3');
  audio[7] = loadSound('assets/audio24.mp3');
  audio[8] = loadSound('assets/audio25.mp3');

  print("audio.length = " + audio.length);
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
  //text('tap here to play', 10, 20);

  // On règle la taille du disque afin qu'il soit responsive
  disque_dia = windowHeight/2; // le disque fera la moitié de la hauteur de l'écran


  for(let i = 0 ; i < audio.length ; i++){
    //audio[i].setVolume(0.5); 
    amp[i] = new p5.Amplitude(0.5);// on peut régler ici les paramètres de l'analyseur de son (ex: smoothing) : https://p5js.org/reference/#/p5.Amplitude 
    amp[i].setInput(audio[i]);
    amp[i].toggleNormalize();
    amp_smooth[i] = 0; // initialiser le smooth
  }

  // Initialisation des tableaux pour les oscillations (audio2)
  for (let i = 0; i < osc_num; i++) {
    osc_x[i] = 0;
    osc_y[i] = 0;
  }
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

  for(let i = 0 ; i < audio.length ; i++){
    amp_smooth[i] += (amp[i].getLevel() - amp_smooth[i])*smoothingFactor;
  }

  if(univers1){
    background(0,100,0);
  }
  else{
    background(0,0,100);
  }

  let ncurrentsegment = 20;
  //let ncurrentsegment = map(mouseY,0,height,0,nsegment+1);




  if(univers1){  
    // PLAN 1 FLASH //////////////////////////////////////////////////////   
    if(audio[4].isPlaying()){
      //print("amp[4].getLevel() = " + amp[4].getLevel());  // pour régler la valeur du 3e paramètre de la ligne suivante
      let flash = map(amp[4].getLevel(), 0, 0.6, 0, 100); 
      background(color(317, 17, 85, flash));
    }
    // PLAN 2 APPARITION ///////////////////////////////////////////////////////   
    if(audio[5].isPlaying()){
      push();
      rectMode(CORNER);
      rect_apparition = map(audio[5].currentTime(), 0, audio[5].duration(),0, windowWidth-marge ); 
      fill('#677AD1');
      noStroke();
      rect(marge,height/2-60,rect_apparition-60,30);// on décale de 60 pixels vers le haut
      rect(marge,height/2,rect_apparition,30);
      rect(marge,height/2+60,rect_apparition+60,30);// on décale de 60 pixels vers le bas
      pop();
    }
    else{
      rect_apparition = 0;// on remet à zéro la largeur du rectangle quand le son n'est plus joué
    }
    // PLAN ? ROTATION DE COORDONNÉES POLAIRES //////////////////////////////////////////////////////   
    if(audio[1].isPlaying()){
        push();
        translate(width/2,height/2);
        rotate((audio[1].currentTime()*2));
        noStroke();
        fill('#9A9B56');
        noStroke();
        for (let i = 0; i < ncurrentsegment; i++) { 
            let angle = map(i, 0, ncurrentsegment, 0, TWO_PI);
            let x = windowWidth / 2 + disque_dia * cos(angle);
            let y = windowHeight / 2 + disque_dia * sin(angle);
            circle(x-width/2,y-height/2,20)
        }
        pop();
    }
    // PLAN ? SIN WAVES  ///////////////////////////////////////////////////////   
    if(audio[2].isPlaying()){
        print("amp_smooth[2] = " + amp_smooth[2]);  // pour régler la valeur du 3e paramètre de la ligne suivante
        oscillation = map(amp_smooth[2], 0, 0.6, marge, windowHeight-marge); // on convertit l'amplitude
        let posX = map(audio[2].currentTime(), 0, audio[2].duration(), marge, windowWidth-marge);
        for (var i = osc_num-1; i > 0; i--) {
          osc_x[i] = osc_x[i-1];
          osc_y[i] = osc_y[i-1];
        }
        osc_x[0] = posX;
        osc_y[0] = oscillation;
        noStroke();
        stroke('#5E9F89');
        if(posX>marge){
          for (let i = 1; i < osc_num; i++) {
            line(osc_x[i],osc_y[i],osc_x[i-1],osc_y[i-1]);
          }
        }
        fill('#E94956');
        noStroke(); 
        circle(posX,oscillation,10);
    }
    else{
        // on remet à zéro les positions d'oscillation quand le son n'est plus joué
        posX = 0;
        oscillation = 0;
        for (let i = 0; i < osc_num; i++) {
          osc_x[i] = 0;
          osc_y[i] = 0;
        }
    }
  
      // PLAN ? // BOUNCE //////////////////////////////////////////////////////   
    if(audio[3].isPlaying()){
        print("amp_smooth[3] = " + amp_smooth[3]);
        fill('#948D60');
        noStroke();
        circle(windowWidth/2,windowHeight/2,amp_smooth[3]*1000);
    }
    // PLAN ? ROTATION ////////////////////////////////////////////////////// 
    if(audio[0].isPlaying()){
      push();
      translate(width/2,height/2);
      rotate((audio[0].currentTime()*2));
      noStroke();
      fill('#E94956');
      rect(0,0,disque_dia,25);
      fill(0,0,100);
      text(audio[0].currentTime()*2,265,0);
      pop();
    }
    // PLAN ? DÉDOUBLEMENT LETTRE //////////////////////////////////////////////////////
    textSize(100);
    if(audio[6].isPlaying()){
      print("amp_smooth[6] = " + amp_smooth[6]);  // pour régler la valeur du 3e paramètre de la ligne suivante
      let dedoublement = map(amp_smooth[6], 0, 0.6, 0, 200); // on convertit l'amplitude
      noStroke();
      fill('#3E805A')
      text("A",windowWidth/4*1-dedoublement,windowHeight/2);
      text("A",windowWidth/4*1+dedoublement,windowHeight/2);
    }
    if(audio[7].isPlaying()){
      print("amp_smooth[7] = " + amp_smooth[7]);  // pour régler la valeur du 3e paramètre de la ligne suivante
      let dedoublement = map(amp_smooth[7], 0, 0.6, 0, 200); // on convertit l'amplitude
      noStroke();
      fill('#E94956')
      text("B",windowWidth/4*2-dedoublement,windowHeight/2);
      text("B",windowWidth/4*2+dedoublement,windowHeight/2);
    }
    if(audio[8].isPlaying()){
      print("amp_smooth[8] = " + amp_smooth[8]);  // pour régler la valeur du 3e paramètre de la ligne suivante
      let dedoublement = map(amp_smooth[8], 0, 0.6, 0, 200); // on convertit l'amplitude
      noStroke();
      fill('#9A9B56')
      text("C",windowWidth/4*3-dedoublement,windowHeight/2);
      text("C",windowWidth/4*3+dedoublement,windowHeight/2);
    }
  }
  else{    
    // PLAN 1 //////////////////////////////////////////////////////
    if(audio[2].isPlaying()){
      //print("amp[2].getLevel() = " + amp[2].getLevel()); // pour régler la valeur du 3e paramètre de la ligne suivante
      let flash = map(amp[2].getLevel(), 0, 0.6, 0, 100); 
      noStroke();
      fill(color(317, 17, 85, flash));
      for(let i = 0 ; i < windowWidth+100 ; i+=windowWidth/10-5){
        circle(i,0,windowWidth/10);
        circle(i,windowHeight,windowWidth/10 );
      }
    }
      // PLAN 2 ///////////////////////////////////////////////////////   
    if(audio[5].isPlaying()){
      push();
      rectMode(CORNER);
      rect_apparition = map(audio[5].currentTime(), 0, audio[5].duration(),0, windowWidth-marge ); 
      fill('#677AD1');
      noStroke();
      rect(marge,height/2-60,rect_apparition-60,30);// on décale de 60 pixels vers le haut
      rect(marge,height/2,rect_apparition,30);
      rect(marge,height/2+60,rect_apparition+60,30);// on décale de 60 pixels vers le bas
      pop();
    }
    else{
      rect_apparition = 0;// on remet à zéro la largeur du rectangle quand le son n'est plus joué
    }
   // PLAN ? ////////////////////////////////////////////////////// 
    if(audio[0].isPlaying()){
      //print("amp[0].getLevel() = " + amp[0].getLevel());
      push();
      translate(width/2,height/2);
      rotate((audio[0].currentTime()*2));
      noStroke();
      fill('#E94956');
      rect(0,0,disque_dia,25);
      textSize(20);
      fill(0,0,100);
      text(audio[0].currentTime()*2,0,0);
      pop();
    }
  }

  // Animations standards pour tester que tout fonctionne bien
  /** 
  for(let i = 0 ; i < audio.length ; i++){
  if(audio[i].isPlaying()){
     push();
     translate(width/2,height/2);
     rotate((audio[i].currentTime()*2));
     let cell = getGridCell(mouseX, mouseY);
     scale(amp_smooth[i]*5);
     fill(map(i,0,audio.length,0,360),100,100,50);
     square(0,0,200);
     pop();
   }
  }
  */



   if(mouseIsPressed){
    let cell = getGridCell(mouseX, mouseY);
    print("Case: " + cell.id + " (x:" + cell.x + ", y:" + cell.y + ")");
    print("mousePressed at (" + mouseX + ", " + mouseY + ")");

   }


  
  if(infoON){     
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

  // Bouton pour basculer les univers en haut à gauche
  fill(univers1 ? color(0, 100, 100) : color(240, 100, 100));
  // Bouton pour basculer les univers en haut à gauche
  fill(univers1 ? color(0, 100, 100) : color(240, 100, 100));
  stroke(255);
  strokeWeight(2);
  rect(25, 25, 30, 30, 5);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  text(univers1 ? 'U1' : 'U2', 25, 25);

  // Bouton pour afficher/masquer la grille d'information
  fill(infoON ? color(60, 100, 100) : color(0, 0, 40));
  stroke(255);
  strokeWeight(2);
  rect(65, 25, 30, 30, 5);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  text(infoON ? 'I' : 'i', 65, 25);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function touchStarted() {
  userStartAudio(); // aide si l'audio est bloqué par la politique du navigateur
  if (touches.length > 0) {
    // Vérifier si on touche le bouton univers
    if (touches[0].x > 10 && touches[0].x < 40 && touches[0].y > 10 && touches[0].y < 40) {
      univers1 = !univers1;
      print("univers1 = " + univers1);
    } 
    // Vérifier si on touche le bouton info
    else if (touches[0].x > 50 && touches[0].x < 80 && touches[0].y > 10 && touches[0].y < 40) {
      infoON = !infoON;
      print("infoON = " + infoON);
    } 
    else {
      let cell = getGridCell(touches[0].x, touches[0].y);
      for(let i = 0 ; i < audio.length ; i++){
        if (cell.id === i && !audio[i].isPlaying()) {
          audio[i].play();
        }
      }
    }
    // Mark each touch point once with a circle.
    for (let touch of touches) {
      circle(touch.x, touch.y, 40);
    }
  }
  return false; // empêche le scroll par défaut sur mobile
}

function mousePressed() {
  // Vérifier si on clique le bouton univers
  if (mouseX > 10 && mouseX < 40 && mouseY > 10 && mouseY < 40) {
    univers1 = !univers1;
    print("univers1 = " + univers1);
  } 
  // Vérifier si on clique le bouton info
  else if (mouseX > 50 && mouseX < 80 && mouseY > 10 && mouseY < 40) {
    infoON = !infoON;
    print("infoON = " + infoON);
  } 
  else {
    let cell = getGridCell(mouseX, mouseY);
    for(let i = 0 ; i < audio.length ; i++){
      if (cell.id === i && !audio[i].isPlaying()) {
        audio[i].play();
      }
    }
  }
}


function keyPressed() {
    if(key == ' '){
      univers1 = !univers1;
      print("univers1 = " + univers1);
    }
    if (key == 'a' && !audio[0].isPlaying()) {
      audio[0].play();
    }
    if (key == 'z' && !audio[1].isPlaying()) {
      audio[1].play();
    }
    if (key == 'e' && !audio[2].isPlaying()) {
      audio[2].play();
    }
    if (key == 'r' && !audio[3].isPlaying()) {
      audio[3].play();
    }
    if (key == 't' && !audio[4].isPlaying()) {
      audio[4].play();
    }
    if (key == 'y' && !audio[5].isPlaying()) {
      audio[5].play();
    }
    if (key == 'u' && !audio[6].isPlaying()) {
      audio[6].play();
    }
    if (key == 'i' && !audio[7].isPlaying()) {
      audio[7].play();
    }
    if (key == 'o' && !audio[8].isPlaying()) {
      audio[8].play();
    }
}

/** 
function canvasPressed() {
  // playing a sound file on a user gesture
  // is equivalent to `userStartAudio()`
  mySound.play();
}
*/
