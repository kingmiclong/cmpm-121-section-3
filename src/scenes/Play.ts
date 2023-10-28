import * as Phaser from 'phaser';
import starfieldUrl from '/assets/starfield.png';
import shipUrl from '/assets/ship.png';
import enemyShipUrl from '/assets/enemy.png';

export default class Play extends Phaser.Scene {
  private fire?: Phaser.Input.Keyboard.Key;
  private left?: Phaser.Input.Keyboard.Key;
  private right?: Phaser.Input.Keyboard.Key;

  private starfield?: Phaser.GameObjects.TileSprite;
  private ship?: Phaser.Physics.Arcade.Sprite;  // Changed to Physics.Arcade.Sprite
  private enemyShips?: Phaser.Physics.Arcade.Group;

  private isShipLaunched = false;

  constructor() {
    super('play');
  }

  preload() {
    this.load.image('starfield', starfieldUrl);
    this.load.image('ship', shipUrl);
    this.load.image('enemyShip', enemyShipUrl);
  }

  private addKey(name: keyof typeof Phaser.Input.Keyboard.KeyCodes): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.addKey('F');
    this.left = this.addKey('LEFT');
    this.right = this.addKey('RIGHT');

    this.starfield = this.add.tileSprite(0, 0, this.game.config.width as number, this.game.config.height as number, 'starfield').setOrigin(0, 0);
    this.ship = this.physics.add.sprite(320, 400, 'ship');  // Changed to physics.add.sprite

    this.enemyShips = this.physics.add.group({
      key: 'enemyShip',
      repeat: 4,
      setXY: { x: 100, y: 100, stepX: 100 }
    });

    // Add collision detection
    this.physics.add.collider(
      this.ship!, 
      this.enemyShips!, 
      (ship, enemy) => {
        this.handleCollision(ship as Phaser.Physics.Arcade.Sprite, enemy as Phaser.Physics.Arcade.Sprite);
      }, 
      undefined,  // Explicitly pass undefined
      this
    );
    
  }

  update() {
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

    // Move enemy ships
    this.enemyShips?.children.iterate((enemy: any) => {
      if (enemy) {
        let typedEnemy = enemy as Phaser.GameObjects.Sprite;  // Type cast to Sprite
        typedEnemy.x += 3;
        if (typedEnemy.x > 800) {
          typedEnemy.x = -100;
        }
      }
      return null;  // Return null to satisfy TypeScript
    });

    if (this.fire?.isDown && !this.isShipLaunched && this.ship) {
      this.isShipLaunched = true;
      this.ship.setVelocity(0, -200);  // Added velocity setting for ship
    }
  }

  private handleCollision(ship: Phaser.Physics.Arcade.Sprite, enemy: Phaser.Physics.Arcade.Sprite) {
    // Reset ship to original position
    ship.setPosition(320, 400);
    ship.setVelocity(0, 0);
    this.isShipLaunched = false;
  
    // Destroy the enemy
    enemy.destroy();
  }
}
