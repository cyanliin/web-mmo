import Vector2D from './Vector2D';
import { uid } from 'uid';
import config from '../config';

class GameObject {
  constructor(data) {
    this.id = data?.id || uid();
    this.name = data?.name || 'Unamed';;
    this.position = data?.position || new Vector2D();
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  draw(ctx) {

  }

  debugDraw(ctx) {

    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    // Pivot Point
    ctx.strokeStyle = config.DEBUG_DRAW.PIVIOT_COLOR;
    ctx.strokeWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(- config.DEBUG_DRAW.PIVIOT_SIZE / 2, 0);
    ctx.lineTo(config.DEBUG_DRAW.PIVIOT_SIZE / 2, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, - config.DEBUG_DRAW.PIVIOT_SIZE / 2);
    ctx.lineTo(0, + config.DEBUG_DRAW.PIVIOT_SIZE / 2);
    ctx.stroke();

    ctx.restore();
  }
}

export default GameObject;