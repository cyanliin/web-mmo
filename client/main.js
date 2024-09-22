import Engine from './src/Engine';
import './src/styles/main.scss';

const engine = new Engine({
  parentId: 'gameView',
  targetFPS: 24,
})


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
