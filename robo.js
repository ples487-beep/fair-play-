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
    this.bloqueado=false;
  }

  hit() {
    this.hitFlash = 10;
  }

  soco(cordx,cordy,timeStart,preTime){
    this.estado = "winduploop";
    this.lastSocoTime=timeStart+preTime;
    this.socoCordsX=cordx;
    this.socoCordsY=cordy;
    this.bloqueado=false;
    print("start soco"+ cordx +cordy + "moment:"+this.lastSocoTime);
    
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
    if(this.estado === "windup" || this.estado ==="soco" || this.estado === "winduploop"){
      if(time>this.lastSocoTime-15){
    image(luva,this.socoCordsX,this.socoCordsY,64,64);
    //print(this.estado + this.socoCordsX + this.socoCordsY)
    this.estado="soco";
      }
    if(time>this.lastSocoTime && this.estado ==="soco" && this.bloqueado===false){
      print("stopSoco");
      this.estado="idle";
      print(this.estado);
      PlayerLife=PlayerLife-1;
      print("PlayerLife-1");
      print(PlayerLife);
    }
    }
  }

  atualizar() {
    if (this.hitFlash > 0) this.hitFlash--;
  }

  levarSoco(Cordx, Cordy) {
    if (dist(Cordx, Cordy, this.x, this.y) < 150 && this.estado != "blockloop") {
      this.life = this.life - 1;
      this.hit();
      print("dano");
    }
  }
}
