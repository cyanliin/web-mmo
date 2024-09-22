import ServerPlayer from './ServerPlayer.js';

class ServerPlayerManager {
  constructor() {
    this.players = {}; // 用一個 object 來儲存玩家，key 是玩家的 id
  }

  // 添加玩家
  addPlayer(id, name) {
    if (!this.players[id]) {
      const newPlayer = new ServerPlayer(id, name);
      this.players[id] = newPlayer;
      console.log(`Player ${name} (ID: ${id}) joined the game.`);
      return newPlayer;
    }
    return null;
  }

  // 移除玩家
  removePlayer(id) {
    if (this.players[id]) {
      const deletedPlayer = this.players[id].getData();
      delete this.players[id];
      console.log(`Player ${deletedPlayer.name} (ID: ${id}) left the game.`);
      return deletedPlayer;
    }
  }

  // 查找玩家
  getPlayer(id) {
    return this.players[id];
  }

  // 取得所有玩家狀態
  getAllPlayersData() {
    const playersData = {};
    for (const id in this.players) {
      playersData[id] = this.players[id].getData();
    }
    return playersData;
  }

  // 更新玩家位置
  updatePlayerPosition(id, newPosition) {
    const player = this.getPlayer(id);
    if (player) {
      player.updatePosition(newPosition.x, newPosition.y);
      return true;
    }
    return false;
  }

  // 更新玩家血量
  updatePlayerHealth(id, amount) {
    const player = this.getPlayer(id);
    if (player) {
      player.updateHealth(amount);
    }
  }
}

export default ServerPlayerManager;