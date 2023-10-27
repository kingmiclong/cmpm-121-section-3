import * as Phaser from "phaser";
import starfieldUrl from "/assets/starfield.png";
import shipUrl from "/assets/ship.png"; // Make sure to add your ship asset here

export default class Play extends Phaser.Scene {
  private fire?: Phaser.Input.Keyboard.Key;
  private left?: Phaser.Input.Keyboard.Key;
  private right?: Phaser.Input.Keyboard.Key;

  private starfield?: Phaser.GameObjects.TileSprite;
  // private spinner?: Phaser.GameObjects.Shape; // Commented out since not being used
  private ship?: Phaser.GameObjects.Sprite; // New Ship sprite

  // private rotationSpeed = Phaser.Math.PI2 / 1000; // Commented out since not being used
  private isShipLaunched = false; // New flag to check if ship is launched

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
    this.load.image("ship", shipUrl); // New Ship sprite
  }

  private addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.addKey("F");
    this.left = this.addKey("LEFT");
    this.right = this.addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);
    this.ship = this.add.sprite(320, 400, "ship"); // Initialize Ship
  }

  update() {
    // Removed '_timeMs' and '_delta'
    if (this.starfield) {
      this.starfield.tilePositionX -= 4;
    }

    // Lock ship controls if launched
    if (!this.isShipLaunched) {
      if (this.left?.isDown && this.ship) {
        this.ship.x -= 4;
      }
      if (this.right?.isDown && this.ship) {
        this.ship.x += 4;
      }
    }

    if (this.fire?.isDown && !this.isShipLaunched && this.ship) {
      this.isShipLaunched = true;
      // Add logic for launching the ship
    }
  }
}
