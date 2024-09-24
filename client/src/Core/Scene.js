class Scene {
  constructor(engine) {
    this.engine = engine;
    this.sceneKey = 'scene'; // 每個場景唯一的 key，用於網路資料判斷場景
    this.localPlayer = null;
  }

  onEnter() {
    // 進入場景時執行一次，初始化物件
    console.log(`Enter scene: ${this.sceneKey}`);
    this.localPlayer = this.engine.localPlayer;
  }

  update(deltaTime) {
    // 遊戲迴圈

    // 更新玩家
    if (this.localPlayer) {
      this.localPlayer.update(this.engine.inputManager, deltaTime);
    }
  }

  render(ctx) {
    // 背景
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, this.engine.width, this.engine.height);

    // 虛擬搖桿
    if (this.engine.joystick) {
      this.engine.joystick.render();
    }

    // 繪製玩家
    this.renderPlayers(ctx);
  }

  // 繪製所有玩家
  renderPlayers(ctx) {
    this.engine.playerManager.players.forEach((player) => {
      // 在這裡實現玩家的渲染邏輯
      player.draw(ctx);

      if (this.engine.enableDebugDraw) {
        player.debugDraw(ctx);
      }
    });
  }

  onLeave() {
    // 離開場景時執行一次
  }

}

export default Scene;