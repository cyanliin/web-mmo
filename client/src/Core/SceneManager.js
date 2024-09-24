class SceneManager {
  constructor(engine) {
    this.engine = engine;
    this.scenes = new Map();
    this.activeScene = null;
  }

  addScene(id, scene) {
    this.scenes.set(id, scene);
  }

  enterScene(id) {
    // 離開上一個場景
    if (this.activeScene) {
      this.activeScene.onLeave();
    }

    // 進入目標場景
    this.activeScene = this.scenes.get(id);
    if (!this.activeScene) {
      console.error(`Cannot find scene id:${id}`);
    }

    this.activeScene.onEnter();
  }
}

export default SceneManager;