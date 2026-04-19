class Robot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 256;
    this.height = 256;
    this.hitFlash = 0;
    this.life = 3;
    this.estado = "idle"; // idle | windup | winduploop | soco | block | blockloop
  }

  hit() {
    this.hitFlash = 10;
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