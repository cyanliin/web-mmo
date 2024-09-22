import GameObject from './GameObject';

class Player extends GameObject {
  constructor(data) {
    super(data);
    this.hp = data?.hp || 100;
    this.speed = data?.speed || 5;
    this.level = data?.level || 0;
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      x: Math.round(this.position.x),
      y: Math.round(this.position.y),
      hp: this.hp,
      level: this.level,
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = 'gray';
    ctx.fillRect(-10, -10, 20, 20);
    ctx.restore();
  }
}

export default Player;