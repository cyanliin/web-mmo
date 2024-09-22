class ServerPlayer {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.position = { x: 200, y: 200 }; // 玩家初始位置
    this.health = 100; // 初始血量
    this.level = 1; // 玩家等級
  }

  // 更新玩家位置
  updatePosition(x, y) {
    this.position = { x, y };
  }

  // 改變玩家血量
  updateHealth(amount) {
    this.health = Math.max(0, this.health + amount); // 血量不能低於 0
  }

  // 取得玩家狀態
  getData() {
    return {
      id: this.id,
      name: this.name,
      position: this.position,
      health: this.health,
      level: this.level,
    };
  }
}

export default ServerPlayer;