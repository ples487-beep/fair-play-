class Robot {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 64;
      this.height = 160;
      this.hitFlash = 0;
    }
  
    hit() {
      this.hitFlash = 10; // frames que fica vermelho
    }
  
    desenhar() {
      fill(this.hitFlash > 0 ? color(255, 0, 0) : color(0));
      rect(this.x, this.y, this.width, this.height);
    }
  
    atualizar() {
      if (this.hitFlash > 0) this.hitFlash--;
    }
  }
