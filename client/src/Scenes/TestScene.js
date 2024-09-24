import Scene from "../Core/Scene";

class TestScene extends Scene {
  constructor(engine) {
    super(engine);
    this.sceneKey = 'test';
  }

  onEnter() {
    super.onEnter();
  }

  update(deltaTime) {
    super.update(deltaTime);
  }

  render(ctx) {
    super.render(ctx);
  }
}

export default TestScene;