import Player from './Player'

class PlayerManager {
  constructor(engine) {
    this.engine = engine;
    this.players = new Map();
    this.localPlayerId = null;
  }

  // 取得玩家數量
  getPlayerCount() {
    return this.players.size;
  }

  // 取得玩家
  getPlayerById(id) {
    return this.players.get(id);
  }

  // 獲取本地玩家
  getLocalPlayer() {
    return this.players.get(this.localPlayerId);
  }

  // 添加玩家
  addPlayer(player) {
    console.log(player)
    // 確認有資料
    if (!player) {
      console.error(`addPlayer failed. Cannot add null.`);
      return;
    }

    // 確認不重複
    if (this.players.has(player.id)) {
      console.error(`addPlayer failed. Player(ID: ${player.id}) already exists.`);
      return;
    }

    // 添加
    this.players.set(player.id, player);
  }

  // 移除玩家
  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  // 更新玩家資訊
  updatePlayerPosition(playerId, x, y) {
    const player = this.players.get(playerId);
    if (player) {
      player.position.x = x;
      player.position.y = y;
    }
  }

  updatePlayerHealth(playerId, newHealth) {
    const player = this.players.get(playerId);
    if (player) {
      this.player.setHealth(newHealth);
    }
  }

  // 更新玩家狀態
  /*
  updatePlayersState(playersData) {
    Object.keys(playersData).forEach(playerId => {
      if (this.players[playerId]) {
        // 更新已存在的玩家位置
        this.players[playerId].setPosition(playersData[playerId].position);
      } else {
        // 如果是新玩家，創建新的 Player 並添加
        const newPlayer = new Player(playersData[playerId]);
        this.addPlayer(newPlayer);
      }
    });
  }
    */
}

export default PlayerManager