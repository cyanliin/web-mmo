import '../styles/engine.scss';

import config from '../config';
import Vector2D from './Vector2D';
import NetworkManager from './NetworkManager';
import PlayerManager from './PlayerManager';
import InputManager from './InputManager';
import SceneManager from './SceneManager';
import ChatPanel from './ChatPanel';
import Joystick from './Joystick';
import LocalPlayer from './LocalPlayer';

class Engine {
  constructor(attrs) {

    this.width = attrs?.width || 500;
    this.height = attrs?.height || 500;
    this.scaleFactor = attrs?.scaleFactor || 1;
    this.host = attrs?.host || config.SERVER_HOST;
    this.eventListeners = {};
    this.enableDebugHud = attrs.enableDebugHud !== undefined ? attrs.enableDebugHud : true;
    this.enableDebugDraw = attrs.enableDebugDraw !== undefined ? attrs.enableDebugDraw : true;

    // FPS 計算相關屬性
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fps = 0;
    this.fpsUpdateInterval = 1000; // 每秒更新一次 FPS
    this.lastFpsUpdate = 0;

    // 要放置遊戲畫面的父層元件ID
    this.parentDom = document.getElementById(attrs.parentId);

    // DOMs
    this.wrapperDom = null;
    this.displayCav = null;
    this.bufferCav = null;

    // Ctx
    this.displayCtx = null;
    this.bufferCtx = null;

    // 建立基礎元件
    this.initDoms(this.parentDom);

    // 玩家管理
    this.playerManager = new PlayerManager(this);

    // 網路管理
    this.networkManager = new NetworkManager(this, this.host);

    // 場景管理
    this.sceneManager = new SceneManager(this);

    // 虛擬搖桿
    this.joystick = new Joystick(this.displayCav, this.bufferCtx);

    // 操作管理
    this.inputManager = new InputManager(this);
    this.inputManager.setJoystick(this.joystick);

    // 聊天面板
    this.chatPanel = new ChatPanel(this);
    this.appendDom(this.chatPanel.getDom());

    // 建立本地玩家
    this.localPlayer = new LocalPlayer({
      id: 'local',
      name: this.generateRandomPlayerName(), 
      position: new Vector2D(100, 100),
    }, this.networkManager);
    this.playerManager.addPlayer(this.localPlayer);
  }

  addEventListener(event, callback) {
    this.eventListeners[event] = callback;
  }

  removeEventListener(event) {
    delete this.eventListeners[event];
  }

  callEvent(event, param) {
    if (this.eventListeners[event]) {
      this.eventListeners[event](param);
    }
  }

  generateRandomPlayerName() {
    const adjectives = ['Brave', 'Mighty', 'Clever', 'Swift', 'Fierce', 'Silent', 'Noble', 'Bold', 'Lucky', 'Daring'];
    const nouns = ['Warrior', 'Mage', 'Hunter', 'Rogue', 'Paladin', 'Druid', 'Knight', 'Ranger', 'Sorcerer', 'Berserker'];
  
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 100);  // 生成0到99之間的隨機數字
  
    return `${randomAdjective}${randomNoun}${randomNumber}`;
  }

  appendDom(dom) {
    this.wrapperDom.appendChild(dom);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;

    this.wrapperDom.style.width = `${this.width}px`;
    this.wrapperDom.style.height = `${this.height}px`;

    this.displayCav.setAttribute('width', this.width * this.scaleFactor);
    this.displayCav.setAttribute('height', this.height * this.scaleFactor);
    this.displayCav.style.width = `${this.width}px`;
    this.displayCav.style.height = `${this.height}px`;

    this.bufferCav.setAttribute('width', this.width * this.scaleFactor);
    this.bufferCav.setAttribute('height', this.height * this.scaleFactor);
  }

  onNetworkConnected() {
    console.log('Successfully connected to the server');
    this.callEvent('networkConnected');
    // 可以在此處執行額外的初始化，例如同步現有玩家的數據

    // 玩家登入主機
    this.playerManager.removePlayer('local');
    this.networkManager.joinGame(this.localPlayer.getData());
  }

  onNetworkDisconnected(reason) {
    console.log('Disconnected from server:', reason);
    this.callEvent('networkDisconnected');
    // 處理斷開連接的邏輯
  }

  onNetworkReconnecting(attempt) {
    console.log(`Reconnecting attempt ${attempt}`);
    this.callEvent('networkReconnecting');
    // 可能會在遊戲界面上顯示 "重連中..." 之類的提示
  }

  onNetworkFailed() {
    console.log('Failed to reconnect');
    this.callEvent('networkFailed');
    // 處理無法連接的情況
  }

  onNetworkError(error) {
    console.error('Network error:', error);
    this.callEvent('networkError');
  }

  initDoms(parentDom) {
    // 建立 Wrapper
    // 用於包裝全部元件
    this.wrapperDom = document.createElement('div');
    this.wrapperDom.className = 'wme-wrapper';
    this.wrapperDom.style.width = `${this.width}px`;
    this.wrapperDom.style.height = `${this.height}px`;

    // 建立 Display Canvas 
    // 用於顯示最終遊戲畫面
    this.displayCav = document.createElement('canvas');
    this.displayCav.className = 'wme-cav';
    this.displayCav.setAttribute('width', this.width * this.scaleFactor);
    this.displayCav.setAttribute('height', this.height * this.scaleFactor);
    this.displayCav.style.width = `${this.width}px`;
    this.displayCav.style.height = `${this.height}px`;
    this.displayCav.style.imageRendering = 'pixelated';
    this.wrapperDom.appendChild(this.displayCav);

    // 取得 Canvas 繪製物件
    this.displayCtx = this.displayCav.getContext('2d');

    // 建立 Buffer Canvas
    // 用於虛擬繪製每個 frame 的所有內容，再一次繪製到 Display Canvas，提高運算效率
    this.bufferCav = document.createElement('canvas');
    this.bufferCav.setAttribute('width', this.width * this.scaleFactor);
    this.bufferCav.setAttribute('height', this.height * this.scaleFactor);
    this.bufferCtx = this.bufferCav.getContext('2d');

    // 加入於畫面
    if (parentDom) {
      parentDom.appendChild(this.wrapperDom);
    }
  }

  // 更新 FPS 計算
  updateFps(currentTime) {
    this.frameCount++;
    if (currentTime > this.lastFpsUpdate + this.fpsUpdateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
      this.lastFpsUpdate = currentTime;
      this.frameCount = 0;
    }
  }

  // 登錄場景
  addScene(sceneId, scene) {
    this.sceneManager.addScene(sceneId, scene);
  }

  // 進入場景
  enterScene(sceneId) {
    this.sceneManager.enterScene(sceneId);
  }

  // 遊戲主循環
  gameLoop(currentTime) {
    const deltaTime = (currentTime - this.lastFrameTime) / 1000; // 以秒為單位的 deltaTime
    this.lastFrameTime = currentTime; // 更新上次幀的時間

    this.updateFps(currentTime);
    this.update(deltaTime);
    
    this.render();
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  // 更新遊戲狀態
  update(deltaTime) {
    // 在這裡更新遊戲狀態，例如玩家移動、碰撞檢測等
    if (this.sceneManager.activeScene) {
      this.sceneManager.activeScene.update(deltaTime);
    }
  }

  // 繪製遊戲畫面
  render() {

    // 場景繪製
    if (this.sceneManager.activeScene) {
      this.sceneManager.activeScene.render(this.bufferCtx);
    }

    // 繪製 Debug HUD
    if (this.enableDebugHud) {
      this.renderDebugHud();
    }

    // 將緩衝畫布的內容繪製到顯示畫布上
    this.displayCtx.clearRect(0, 0, this.displayCav.width, this.displayCav.height);
    this.displayCtx.drawImage(this.bufferCav, 0, 0);
  }

  // 繪製 Debug HUD
  renderDebugHud() {
    const ctx = this.bufferCtx;
    const hudTextSize = 10 + (this.scaleFactor - 1) * 5;
    const hudLineHeight = 12 + (this.scaleFactor - 1) * 5;
    ctx.font = `${hudTextSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const contents = [];
    contents.push(`Resolution: ${this.width} x ${this.height} (x${this.scaleFactor})`);
    contents.push(`FPS: ${this.fps}`); 
    contents.push(`Host: ${this.host}`); 
    if (this.networkManager.isConnected) {
      contents.push('Network: Connected'); 
    } else {
      contents.push('Network: Disconnect'); 
    }
    if (this.localPlayer) {
      contents.push(`Player ID: ${this.localPlayer.id}`); 
      contents.push(`Position: (${Math.round(this.localPlayer.position.x)}, ${Math.round(this.localPlayer.position.y)})`); 
      contents.push(`Players: ${this.playerManager.getPlayerCount()}`); 
    }

    contents.forEach((item, index) => {
      ctx.fillText(item, 10, 10 + hudLineHeight * index);
    });
  }

  // 新增方法：啟動遊戲
  start() {
    requestAnimationFrame((time) => this.gameLoop(time));
  }
}

export default Engine;