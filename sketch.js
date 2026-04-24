let handPose;
let tela;
let video;
let hands = [];
let imgMao, imgPunho, imgSoco;
let gestoAnterior = ["", ""];
let DoingSoco =[false,false];
let time = 0;
let GetSocosPlayer = [];
let PlayerLife =3;
let gameState= "MENU";
let cutscene;

let robot;

//sounds
let humanPunch;
let roboPunch;

// suavização — uma por mão
let smooth = [
  { x: 0, y: 0 },
  { x: 0, y: 0 }
];
let framesSemMao = [0, 0];

function preload() {
  handPose = ml5.handPose({ maxHands: 2, flipped: true });
  imgMao   = loadImage('mao.png');
  imgPunho = loadImage('punho.png');
  imgSoco  = loadImage('soco.png');
  fundo1 = loadImage('p4 background2.gif');
  roboStanding = loadImage('idle.gif');
  life1 = loadImage('1 life.png');
  life2 = loadImage('2 lifes.png');
  life3 = loadImage('3 life.png');
  robotlife1 =loadImage("robot 1 life.png");
  robotlife2 =loadImage("robot 2 lifes.png");
  robotlife3 =loadImage("robot 3 lifes.png");
  telaNone = loadImage("none.png");
  telaRound1 = loadImage("pixil-frame-0 - 2026-04-15T194218.638.png");
  telaRound2 = loadImage("pixil-frame-0 - 2026-04-15T193332.002.png");
  telaRound3 = loadImage("pixil-frame-0 - 2026-04-15T194739.779.png");
  telaMenu = loadImage("titlescreen.gif");


  roboWindup     = loadImage('sprites/windup.gif');
  roboWindupLoop = loadImage('sprites/winduploop.gif');
  roboSoco       = loadImage('sprites/soco.gif');
  roboBlock      = loadImage('sprites/block.gif');
  roboBlockLoop  = loadImage('sprites/blockloop.gif');
  luva           = loadImage('luva.gif');

  //sons
  humanPunch = loadSound('Meta2/Murro Humano.wav');
  roboPunch = loadSound('Meta2/Murro Robo.wav');

  //cut scena
  cutscene = createVideo('credits.mp4');
cutscene.hide();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  frameRate(30);
  imageMode(CENTER);
  rectMode(CENTER);
  
  robot = new Robot(width / 2, height / 2);

  handPose.detectStart(video, gotHands);
  noSmooth();
}

function draw() {
  //game states
   if (gameState === "MENU") {
  image(telaMenu, 320, 240, 640, 480);
  return;
}
  if (gameState === "ROUND3WON") {
    background(0);
    cutscene.play();
    image(cutscene, 320, 240, 640, 480);
    if (cutscene.time() >= cutscene.duration() - 0.1 ) {
      window.location.href = 'Meta2/tos/teste.html';
    }
    return;
  }
  if(gameState==="ROUND1WON" || gameState === "ROUND2WON"){
    tela="pixil-frame-0 - 2026-04-20T140222.346.png";
  }
  
  if(time<20){
    if(gameState==="PLAYINGROUND1"){
      tela=telaRound1;
    }else if(gameState==="PLAYINGROUND2"){
      tela=telaRound2;
    }else{
      tela=telaRound3;
    }
  }else{
    tela=telaNone;
  }



  tint(150);
  background(255);
  
  image(fundo1,320,240,640,480);
  noTint();
  time=time+1;
  life(PlayerLife,robot.life);
  

  //robot ataques round2
  if(gameState==="PLAYINGROUND2"){
    for(let i=0; i<GetSocosPlayer.length; i++){
      if(GetSocosPlayer[i].moment === time){
        print(i + 'x:'+ GetSocosPlayer[i].cordX + 'y:' +GetSocosPlayer[i].cordY);
        robot.soco(GetSocosPlayer[i].cordX,GetSocosPlayer[i].cordY,GetSocosPlayer[i].moment,30);
      }
    }
  }else if(gameState==="PLAYINGROUND3"){
    if(robot.estado==="idle"){
      let rd= random(10);
      if(rd>5){
        let cordXRd=random(100,600);
        let cordYRd=random(80,400);
        let ReactTimeRd= random(20,40);
        robot.soco(cordXRd,cordYRd,time,ReactTimeRd);
      }else if(rd<4){
        robot.estado="blockloop";
      }
    }
    if(DoingSoco[0]=== true || DoingSoco[1]===true){
      let rd= random(10);
      if(rd>7 && robot.estado==="idle"){
        robot.estado="blockloop";
      }
    }else{
      if(robot.estado==="blockloop"){
        let rd= random(10);
        if(rd>6){
          robot.estado="idle";
        }
      }
    }
  }

  
  
  robot.atualizar();
  robot.desenhar();

  image(tela,320,240,640,480);

// HAND POSE E DETEÇÃO DE GESTOS

  for (let i = 0; i < 2; i++) {
    if (i < hands.length) {
      let hand = hands[i];
      let wrist = hand.keypoints[0];

      // suaviza posição
      smooth[i].x = lerp(smooth[i].x, wrist.x, 0.2);
      smooth[i].y = lerp(smooth[i].y, wrist.y, 0.2);
      framesSemMao[i] = 0;

      let gesto = detectarGesto(hand,i);
      let sprite = gesto === "SOCO"  ? imgSoco
                 : gesto === "PUNHO" ? imgPunho
                 : imgMao;

      if(gesto==="SOCO"){
        robot.levarSoco(wrist.x,wrist.y);
      }

      let ehEsquerda = hand.handedness === "Left";

      push();
      translate(smooth[i].x, smooth[i].y);
      if (ehEsquerda) scale(-1, 1);
      image(sprite, 0, 0, 64, 64);
      pop();


      if(robot.lastSocoTime>time-5 && robot.lastSocoTime<time+5){
        if(dist(wrist.x,wrist.y,robot.socoCordsX,robot.socoCordsY) && gesto === "ABERTA"){
          robot.estado="idle";
          robot.bloqueado=true;
          print("socodefendido");
        }
      }

      if(gameState === "ROUND1WON"){
        if(gesto === "PUNHO" && dist(wrist.x,wrist.y,320,300)<200){
          time=0;
          robot.life=3;
          gameState="PLAYINGROUND2";
          print(gameState);
          print(time);
        }
      }else if(gameState === "ROUND2WON"){
        if(gesto === "PUNHO" && dist(wrist.x,wrist.y,320,300)<200){
          time=0;
          robot.life=3;
          gameState="PLAYINGROUND3";
          print(gameState);
        }
      }else if(gameState === "ROUNDLOSE"){
        if(gesto === "PUNHO" && dist(wrist.x,wrist.y,320,300)<200){
        time=0;
          robot.life=3;
          PlayerLife=3;
          gameState="PLAYINGROUND1";
          print(gameState);
          print(time);
        }
      
  return;
      }

    } else {
      // mão desapareceu — conta frames
      framesSemMao[i]++;
    }
  }

 
}

function gotHands(results) {
  hands = results;
}


function life(lifeP,lifeR){
  let lifePlayerI;
  if(lifeP===1){
    lifePlayerI= life1;
  }else if(lifeP===2){
    lifePlayerI= life2;
  }else{
    lifePlayerI= life3;
  }
  image(lifePlayerI, 320, 440, 96,32);
  
  let lifeRobotI;
  if(lifeR===1){
    lifeRobotI= robotlife1;
  }else if(lifeR===2){
    lifeRobotI= robotlife2;
  }else{
    lifeRobotI= robotlife3;
  }
  tint(255);
  image(lifeRobotI, 320, 50, 96,32);

if(lifeR===0){
  if(gameState==="PLAYINGROUND1"){
    gameState="ROUND1WON";
  }else if(gameState==="PLAYINGROUND2"){
    gameState="ROUND2WON";
  }else if(gameState==="PLAYINGROUND3"){
    gameState="ROUND3WON";
  }
}
if(lifeP ===0){
    gameState="ROUNDLOSE";
}
}


function detectarGesto(hand,n) {
  let wrist  = hand.keypoints[0];
  let midMcp = hand.keypoints[9];
  let tamanho = dist(wrist.x, wrist.y, midMcp.x, midMcp.y);

  const dedos = [
    { mcp: 5,  tip: 8  },
    { mcp: 9,  tip: 12 },
    { mcp: 13, tip: 16 },
    { mcp: 17, tip: 20 },
  ];

  let dobrados = 0;
  for (let d of dedos) {
    let mcp = hand.keypoints[d.mcp];
    let tip = hand.keypoints[d.tip];
    if (tip.y > mcp.y) dobrados++;
  }

  let ePunho = dobrados >= 3;
  let ePerto = tamanho > 120;

  if (ePunho && ePerto){ 
    //doingSoco para impedir o spam 
    if(DoingSoco[n] === false){
      DoingSoco[n] = true;
      //adicionar o soco ao array para o robot imitar na ronda seguinte
      //aaaaaa
      GetSocosPlayer.push({
        cordX: wrist.x,
        cordY: wrist.y,
        moment: time,
      });
      print("soco" + wrist.x + wrist.y);
      print("socos dados:"+ GetSocosPlayer.length)
      print (DoingSoco[n]);
      if(humanPunch){
      humanPunch.play();
      }else{
        humanPunch= loadSound('Meta2/Murro Humano.wav');
      }
      return "SOCO";
    }
    return "PUNHO";
  }
  if(!ePerto){
    DoingSoco[n] = false;
    print (DoingSoco[n]);
  }
  if (ePunho){           
    return "PUNHO";
  }
  if (dobrados <= 1){    
    return "ABERTA";
  }
}

function keyPressed() {
  if (key === '1') robot.estado = "idle";
  if (key === '2') robot.estado = "windup";
  if (key === '3') robot.estado = "soco";
  if (key === '4') robot.estado = "block";
  if(key ==='5') robot.soco(100,100,time+10,30)
}

function mousePressed() {
  if (gameState === "MENU") {
    time = 0;
    gameState = "PLAYINGROUND1";
  }
}











