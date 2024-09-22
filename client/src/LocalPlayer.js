import Player from "./Player";

class LocalPlayer extends Player {
  constructor(data, networkManager) {
    super(data);
    this.speed = 100;
    this.networkManager = networkManager; // 傳入 networkManager
    this.previousPosition = { x: this.position.x, y: this.position.y }; // 記錄前一幀的位置
  }

  update(input, deltaTime) {
    let positionChanged = false;

    // 根據 deltaTime 調整玩家速度
    const adjustedSpeed = this.speed * deltaTime;

    // Keyboard Input
    if (input.keyState.get('ArrowUp')) {
      this.position.y -= adjustedSpeed;
      positionChanged = true;
    }
    if (input.keyState.get('ArrowDown')) {
      this.position.y += adjustedSpeed;
      positionChanged = true;
    }
    if (input.keyState.get('ArrowLeft')) {
      this.position.x -= adjustedSpeed;
      positionChanged = true;
    }
    if (input.keyState.get('ArrowRight')) {
      this.position.x += adjustedSpeed;
      positionChanged = true;
    }

    // Joystick
    this.position.add(input.joystick.velocity.clone().scale(this.speed * deltaTime));
    positionChanged = true;



    // this.position.x = Math.round(this.position.x);
    // this.position.y = Math.round(this.position.y);

    // 如果位置改變，發送新位置給伺服器
    if (positionChanged && (this.position.x !== this.previousPosition.x || this.position.y !== this.previousPosition.y)) {
      this.networkManager.sendPlayerMove(this.position); // 向伺服器發送位置信息
      this.previousPosition = { ...this.position }; // 更新前一幀的位置
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.fillStyle = 'blue';
    ctx.fillRect(-10, -10, 20, 20);
    ctx.restore();
  }
}

export default LocalPlayer;
