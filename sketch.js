let handPose;
let video;
let hands = [];
let wrist = hands[0].keypoints[0];
let midMcp = hands[0].keypoints[9];
text(round(dist(wrist.x, wrist.y, midMcp.x, midMcp.y)), 20, 20);

function preload() {
  // ml5 1.x — carrega ANTES do setup
  handPose = ml5.handPose({ maxHands: 2, flipped: false});
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  frameRate(30);

  // detectStart em vez de .on('predict', ...)
  handPose.detectStart(video, gotHands);
}

function draw() {
  // com flipped:true no modelo, não precisas de espelhar manualmente
  background(255);

  let cores = [color(255, 80, 80), color(80, 160, 255)];

  for (let i = 0; i < hands.length; i++) {
  let gesto = detectarGesto(hands[i]);
  let wrist = hands[i].keypoints[0];
  let x = width - wrist.x;

  noFill();
  stroke(gesto === "PUNHO" ? color(255, 80, 80) : color(80, 200, 120));
  strokeWeight(3);
  ellipse(x, wrist.y, 40, 40);

  fill(0);
  noStroke();
  textAlign(CENTER);
  text(gesto, x, wrist.y - 30);
}
}

function gotHands(results) {
  hands = results;
}

function detectarGesto(hand) {
  let wrist = hand.keypoints[0];
  let midMcp = hand.keypoints[9];
  let tamanho = dist(wrist.x, wrist.y, midMcp.x, midMcp.y);

  const dedos = [
    { mcp: 5, tip: 8  },
    { mcp: 9, tip: 12 },
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

  if (ePunho && ePerto) return "SOCO";
  if (ePunho)           return "PUNHO";
  if (dobrados <= 1)    return "ABERTA";
  return "MEIO";
}