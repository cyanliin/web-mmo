import Vector2D from './Vector2D';  // 引入你的 Vector2D 類別

class Joystick {
  constructor(canvas, ctx, radius = 75, stickRadius = 30, scaleFactor = 1) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.radius = radius; // 搖桿底座半徑
    this.stickRadius = stickRadius; // 搖桿控制柄半徑
    this.active = false;
    this.scaleFactor = scaleFactor;
    
    this.basePos = new Vector2D(); // 搖桿底座的初始位置
    this.currentPos = new Vector2D(); // 搖桿控制柄的位置
    this.velocity = new Vector2D(); // 移動速度向量

    // 綁定觸摸事件
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));

    // 綁定滑鼠事件
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  // 觸摸和滑鼠開始事件共用
  onTouchStart(e) {
    if (this.active) return;
    
    const touch = e.touches[0];
    this.activateJoystick(touch.clientX, touch.clientY);
  }

  onMouseDown(e) {
    if (this.active) return;

    this.activateJoystick(e.clientX, e.clientY);
  }

  // 啟動搖桿
  activateJoystick(x, y) {
    this.active = true;
    this.basePos.set(x, y).scale(this.scaleFactor);
    this.currentPos.set(x, y).scale(this.scaleFactor);
  }

  // 觸摸和滑鼠移動事件共用
  onTouchMove(e) {
    if (!this.active) return;

    const touch = e.touches[0];
    this.moveJoystick(touch.clientX * this.scaleFactor, touch.clientY * this.scaleFactor);
  }

  onMouseMove(e) {
    if (!this.active) return;

    this.moveJoystick(e.clientX * this.scaleFactor, e.clientY * this.scaleFactor);
  }

  // 移動搖桿
  moveJoystick(x, y) {
    const movePos = new Vector2D(x, y);
    const delta = movePos.clone().subtract(this.basePos);
    const distance = delta.length();
    const maxDistance = this.radius;
    
    // 如果控制柄超過底座半徑，限制在最大半徑範圍內
    if (distance > maxDistance) {
      delta.normalize().scale(maxDistance);
      this.currentPos = this.basePos.clone().add(delta);
    } else {
      this.currentPos.set(x, y);
    }

    // 計算 velocity：方向 + 速度比例
    this.velocity = delta.clone().scale(1 / maxDistance); // 根據比例縮放，範圍是 [0, 1]
  }

  // 觸摸和滑鼠結束事件共用
  onTouchEnd() {
    this.deactivateJoystick();
  }

  onMouseUp() {
    this.deactivateJoystick();
  }

  // 停止搖桿
  deactivateJoystick() {
    this.active = false;
    this.velocity.set(0, 0); // 重置方向
  }

  // 繪製虛擬搖桿
  draw() {
    if (!this.active) return;

    const ctx = this.ctx;

    // 繪製搖桿底座
    ctx.beginPath();
    ctx.arc(this.basePos.x, this.basePos.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.stroke();
    ctx.closePath();

    // 繪製搖桿控制柄
    ctx.beginPath();
    ctx.arc(this.currentPos.x, this.currentPos.y, this.stickRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.closePath();
  }
}

export default Joystick;
