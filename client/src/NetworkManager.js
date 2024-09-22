import { io } from 'socket.io-client';
import Player from './Player';

class NetworkManager {
  constructor(engine, host, options = {}) {
    this.engine = engine;
    this.host = host;
    this.options = {
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      timeout: 10000,
      ...options
    };
    this.socket = null;
    this.isConnected = false;
    this.reconnectionAttempts = 0;
    
    this.connect();
  }

  connect() {
    this.socket = io(this.host, {
      reconnection: false, // 我們將手動處理重連
      timeout: this.options.timeout
    });

    this.setupListeners();
  }

  setupListeners() {
    // 建立連線
    this.socket.on('connect', () => {
      console.log('Connected to server...');
      this.isConnected = true;
      this.reconnectionAttempts = 0;
      this.engine.onNetworkConnected();
    });

    // 連線失敗
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleConnectionError();
    });

    // 離線
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.isConnected = false;
      this.engine.onNetworkDisconnected(reason);
      if (reason === 'io server disconnect') {
        // 服務器主動斷開連接，不自動重連
        console.log('Server disconnected the client. Not attempting to reconnect.');
      } else {
        this.handleConnectionError();
      }
    });

    // 設定本地玩家成功登錄後取得 ID
    this.socket.on('playerInfo', (playerInfo) => {
      // 設定本地玩家的 ID
      console.log('playerInfo', playerInfo);
      this.engine.localPlayer.id = playerInfo.id;
      this.engine.localPlayer.position.set(playerInfo.position.x, playerInfo.position.y);

      // 確保本地玩家已加入 PlayerManager
      this.engine.playerManager.addPlayer(this.engine.localPlayer);
    });

    // 收到所有現有玩家的資訊
    this.socket.on('allPlayers', (allPlayersData) => {
      console.log('Received all players:', allPlayersData);
      
        // 透過 Object.values 將物件轉換為陣列
        const playersArray = Object.values(allPlayersData);
        
        // 將所有其他玩家資料加入到 PlayerManager
        playersArray.forEach((playerData) => {
        // 避免重複加入本地玩家
        if (playerData.id !== this.engine.localPlayer.id) {
          this.engine.playerManager.addPlayer(new Player(playerData));
        }
      });
    });

    // 玩家加入遊戲
    this.socket.on('playerJoined', (newPlayerData) => {
      console.log('playerJoined!')
      // 檢查是否是本地玩家
      if (newPlayerData.id === this.engine.localPlayer.id) {
        console.log('Local player detected, skipping re-addition.');
        return; // 跳過本地玩家，不要重複加入
      }
      this.engine.playerManager.addPlayer(new Player(newPlayerData));
    });

    // 玩家離開遊戲
    this.socket.on('playerLeft', (playerId) => {
      console.log('playerLeft!!!');
      this.engine.playerManager.removePlayer(playerId);
    });

    // 玩家位置更新
    this.socket.on('playerMoved', ({playerId, x, y}) => {
      this.engine.playerManager.updatePlayerPosition(playerId, x, y);
    });
  }

  handleConnectionError() {
    if (this.reconnectionAttempts < this.options.reconnectionAttempts) {
      this.reconnectionAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectionAttempts}/${this.options.reconnectionAttempts})...`);
      this.engine.onNetworkReconnecting(this.reconnectionAttempts);
      setTimeout(() => this.connect(), this.options.reconnectionDelay);
    } else {
      console.error('Failed to connect after maximum attempts');
      this.engine.onNetworkFailed();
    }
  }
  

  // 本地玩家加入遊戲
  joinGame(playerData) {
    if (this.isConnected) {
      this.socket.emit('joinGame', playerData);
    } else {
      console.error('Cannot join game: Not connected to server');
      this.engine.onNetworkError('Cannot join game: Not connected to server');
    }
  }

  // 發送本地玩家移動
  sendPlayerMove(position) {
    if (this.isConnected) {
      this.socket.emit('playerMove', {x: Math.round(position.x), y: Math.round(position.y)});
    }
  }

  // 發送本地玩家生命值變化
  sendPlayerHealthChange(newHealth) {
    if (this.isConnected) {
      this.socket.emit('playerHealthChange', newHealth);
    }
  }

  // 手動重新連接方法
  manualReconnect() {
    if (!this.isConnected) {
      this.reconnectionAttempts = 0;
      this.connect();
    }
  }

  // 清理方法，在遊戲結束時調用
  cleanup() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default NetworkManager;
