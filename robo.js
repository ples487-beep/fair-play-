class Robot {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 256;
      this.height = 256;
      this.hitFlash = 0;
      this.life= 3;
    }
  
    hit() {
      this.hitFlash = 10; // frames que fica vermelho
    }
  
    desenhar() {
      fill(this.hitFlash > 0 ? color(255, 0, 0) : color(0));
      image(roboStanding,this.x,this.y,this.width,this.height);
    }

    socar(x,y){

    }

    levarSoco(Cordx,Cordy){
      if(dist(Cordx,Cordy,this.x,this.y)<100){
        this.life=this.life-1;
        print("dano")
      }
    }
  
    atualizar() {
      if (this.hitFlash > 0) this.hitFlash--;
    }
  }
