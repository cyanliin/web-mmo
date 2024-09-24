

class InputManager {
  constructor(engine) {
    this.initInputListeners();
    this.keyState = new Map();
    this.joystick = null;
  }

  setJoystick(joystick) {
    this.joystick = joystick;
  }

  initInputListeners() {
    window.addEventListener('keydown', (event) => {
      this.keyState.set(event.key, true);
    });

    window.addEventListener('keyup', (event) => {
      this.keyState.set(event.key, false);
    });
  }
}

export default InputManager;