import * as Phaser from "phaser";
import Menu from "./scenes/Menu";
import Play from "./scenes/Play";

const config: Phaser.Types.Core.GameConfig = {
  width: 640,
  height: 480,
  scene: [Menu, Play],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

document.title = "Rocket Patrol Remake";
document.body.style.backgroundColor = "beige";

new Phaser.Game(config);