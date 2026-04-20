class Robot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 256;
    this.height = 256;
    this.hitFlash = 0;
    this.life = 3;
    this.estado = "idle"; // idle | windup | winduploop | soco | block | blockloop
    //socoVariaveis
    this.robotDoingSoco=false;
    this.lastSocoTime=0;
    this.socoCordsX=0;
    this.socoCordsY=0;
  }

  hit() {
    this.hitFlash = 10;
  }

  soco(cordx,cordy,timeStart){
    this.estado = "windup";
    this.lastSocoTime=timeStart+20;
    this.socoCordsX=cordx;
    this.socoCordsY=cordy;
    print("start soco"+ cordx +cordy);
    
  }

  desenhar() {
    let sprite;
    if      (this.estado === "windup")     sprite = roboWindup;
    else if (this.estado === "winduploop") sprite = roboWindupLoop;
    else if (this.estado === "soco")       sprite = roboSoco;
    else if (this.estado === "block")      sprite = roboBlock;
    else if (this.estado === "blockloop")  sprite = roboBlockLoop;
    else                                   sprite = roboStanding;

    if (this.hitFlash > 0) tint(255, 0, 0);
    else noTint();

    image(sprite, this.x, this.y, this.width, this.height);
    noTint();
    if(this.estado === "windup" || this.estado ==="soco"){
      if(time>this.lastSocoTime-10){
    image(luva,this.socoCordsX,this.socoCordsY,64,64);
    this.estado="soco";
      }
    if(time>this.lastSocoTime){
      print("stopSoco");
      this.estado="idle";
    }
    }
  }

  atualizar() {
    if (this.hitFlash > 0) this.hitFlash--;
  }

  levarSoco(Cordx, Cordy) {
    if (dist(Cordx, Cordy, this.x, this.y) < 100) {
      this.life = this.life - 1;
      this.hit();
      print("dano");
    }
  }
}
