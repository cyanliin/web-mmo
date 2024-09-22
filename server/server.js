import express from 'express';
import http from 'http';
import chalk from 'chalk';
import { Server } from 'socket.io';
import { networkInterfaces } from 'os';
import cors from 'cors';
import ServerPlayerManager from './src/ServerPlayerManager.js'

const port = 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

const playerManager = new ServerPlayerManager();

io.on('connection', (socket) => {
  console.log('A player connected');

  // 玩家加入遊戲
  socket.on('joinGame', (playerData) => {
    const player = playerManager.addPlayer(socket.id, playerData.name);
    if (player) {
      // 回傳玩家自己的完整資訊
      socket.emit('playerInfo', player);

      // 向新玩家發送所有現有玩家的資訊
      socket.emit('allPlayers', playerManager.getAllPlayersData());

      // 廣播新玩家加入給其他玩家
      socket.broadcast.emit('playerJoined', player);

      console.log(`Player ${player.name} (${player.id}) joined the game`);
    }
  });

  // 玩家移動
  socket.on('playerMove', (newPosition) => {
    if (playerManager.updatePlayerPosition(socket.id, newPosition)) {
      // 廣播玩家新位置給所有其他玩家
      socket.broadcast.emit('playerMoved', {
        playerId: socket.id,
        x: newPosition.x,
        y: newPosition.y,
      });
    }
  });

  // 玩家生命值變化
  socket.on('playerHealthChange', (newHealth) => {
    const updatedPlayer = playerManager.updatePlayerHealth(socket.id, newHealth);
    if (updatedPlayer) {
      // 廣播玩家新生命值給所有玩家（包括自己）
      io.emit('playerHealthUpdated', {
        id: updatedPlayer.id,
        health: updatedPlayer.health
      });
    }
  });

  // 玩家離開遊戲
  socket.on('disconnect', () => {
    const removedPlayer = playerManager.removePlayer(socket.id);
    if (removedPlayer) {
      // 廣播玩家離開給其他玩家
      socket.broadcast.emit('playerLeft', removedPlayer.id);
      console.log(`Player ${removedPlayer.name} (${removedPlayer.id}) left the game`);
    }
  });
});

// 定期更新玩家列表，清除控制台並輸出表格
setInterval(() => {
  printPlayers();
}, 3000); // 每 3 秒更新一次

// 獲取內網 IP 和外網 IP
function getIPAddresses() {
  const nets = networkInterfaces();
  const results = { internal: [], external: [] };

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.internal.push(net.address);
      } else if (net.family === 'IPv4' && net.internal) {
        results.external.push(net.address);
      }
    }
  }
  return results;
}

function printServerInfo() {
  const { internal, external } = getIPAddresses();
  const externalIP = external.length > 0 ? external[0] : 'N/A';
  const internalIP = internal.length > 0 ? internal[0] : 'N/A';
  
  console.clear();
  console.log(chalk.yellow(`Internal IP: ${internalIP}:${port}`));
  console.log(chalk.yellow(`External IP: ${externalIP}:${port}`));
  console.log(chalk.white('Player List:'));
  // This will be updated by `printPlayers()`
}

// 列印玩家表格
function printPlayers() {
  console.clear();
  printServerInfo();

  const players = playerManager.getAllPlayersData();
  console.table(players);
}

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


/*

io.on('connection', (socket) => {
  console.log('A player connected');

  // 玩家加入遊戲
  socket.on('joinGame', (playerData) => {
    const player = playerManager.addPlayer(socket.id, playerData.name);
    
    // 回傳玩家自己的完整資訊
    socket.emit('playerInfo', player);

    // 向新玩家發送所有現有玩家的資訊
    socket.emit('allPlayers', playerManager.getAllPlayers());

    // 廣播新玩家加入給其他玩家
    socket.broadcast.emit('playerJoined', player);

    console.log(`Player ${player.name} (${player.id}) joined the game`);
  });

  // 玩家移動
  socket.on('playerMove', (newPosition) => {
    const updatedPlayer = playerManager.updatePlayerPosition(socket.id, newPosition);
    if (updatedPlayer) {
      // 廣播玩家新位置給所有其他玩家
      socket.broadcast.emit('playerMoved', {
        id: updatedPlayer.id,
        position: updatedPlayer.position
      });
    }
  });

  // 玩家生命值變化
  socket.on('playerHealthChange', (newHealth) => {
    const updatedPlayer = playerManager.updatePlayerHealth(socket.id, newHealth);
    if (updatedPlayer) {
      // 廣播玩家新生命值給所有玩家（包括自己）
      io.emit('playerHealthUpdated', {
        id: updatedPlayer.id,
        health: updatedPlayer.health
      });
    }
  });

  // 玩家離開遊戲
  socket.on('disconnect', () => {
    const removedPlayer = playerManager.removePlayer(socket.id);
    if (removedPlayer) {
      // 廣播玩家離開給其他玩家
      io.emit('playerLeft', removedPlayer.id);
      console.log(`Player ${removedPlayer.name} (${removedPlayer.id}) left the game`);
    }
  });
});

*/