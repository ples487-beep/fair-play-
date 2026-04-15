let handPose;
let video;
let hands = [];
let imgMao, imgPunho, imgSoco;
let gestoAnterior = ["", ""];
let DoingSoco =false;
let time = 0;
let GetSocosPlayer = [];

let robot;

// suavização — uma por mão
let smooth = [
  { x: 0, y: 0 },
  { x: 0, y: 0 }
];
let framesSemMao = [0, 0];

function preload() {
  handPose = ml5.handPose({ maxHands: 2, flipped: true });
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();
  imgMao   = loadImage('mao.png');
  imgPunho = loadImage('punho.png');
  imgSoco  = loadImage('soco.png');
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
}

function draw() {
  background(255);
  time=time+1;
  
  robot.atualizar();
  robot.desenhar();

  for (let i = 0; i < 2; i++) {
    if (i < hands.length) {
      let hand = hands[i];
      let wrist = hand.keypoints[0];

      // suaviza posição
      smooth[i].x = lerp(smooth[i].x, wrist.x, 0.2);
      smooth[i].y = lerp(smooth[i].y, wrist.y, 0.2);
      framesSemMao[i] = 0;

      let gesto = detectarGesto(hand);
      let sprite = gesto === "SOCO"  ? imgSoco
                 : gesto === "PUNHO" ? imgPunho
                 : imgMao;

      let ehEsquerda = hand.handedness === "Left";

      push();
      translate(smooth[i].x, smooth[i].y);
      if (ehEsquerda) scale(-1, 1);
      image(sprite, 0, 0, 64, 64);
      pop();

    } else {
      // mão desapareceu — conta frames
      framesSemMao[i]++;
    }
  }
}

function gotHands(results) {
  hands = results;
}

function detectarGesto(hand) {
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
    if(DoingSoco ==false){
      DoingSoco = true;
      //adicionar o soco ao array para o robot imitar na ronda seguinte
      GetSocosPlayer.push({
        cordX: wrist.x,
        cordY: wrist.y,
        moment: time,
      });
      return "SOCO";
    }
  }
  if(ePerto == false){
    DoingSoco = false;
  }
  if (ePunho){           
    return "PUNHO";
  }
  if (dobrados <= 1){    
    return "ABERTA";
  }
}
