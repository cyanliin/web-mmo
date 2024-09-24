import Engine from './src/Core/Engine';
import TestScene from './src/Scenes/TestScene';
import './src/styles/main.scss';

const engine = new Engine({
  parentId: 'gameView',
  targetFPS: 24,
  enableDebugHud: false,
})

const scene1 = new TestScene(engine);
engine.addScene('test', scene1);
engine.enterScene('test');

engine.start();

function updateGameViewSize() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  if (width > height) {
    width = height;
  }
  if (height > width) {
    // height = width;
  }
  
  // if (width < 500) {
  //   engine.scaleFactor = 2;
  // } 
  // if (width >= 500) {
  //   engine.scaleFactor = 1;
  // } 
  engine.setSize(width, height);
  
}
updateGameViewSize();
addEventListener('resize', updateGameViewSize);
