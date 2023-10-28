import * as Phaser from 'phaser';
import starfieldUrl from '/assets/starfield.png';
import shipUrl from '/assets/ship.png';
import enemyShipUrl from '/assets/enemy.png';

// Prototype for enemy types
interface EnemyPrototype {
  key: string;
  speed: number;
}

const enemyTypes: Record<string, EnemyPrototype> = {
  "fast": {
    key: 'enemyShip',
    speed: 5,
  },
  "slow": {
    key: 'enemyShip',
    speed: 2,
  },
  // ... add more enemy types
};

// Function to create enemy using prototype
function createEnemy(scene: Phaser.Scene, x: number, y: number, type: string) {
  const enemyPrototype = enemyTypes[type];
  if (enemyPrototype) {
    const enemy = scene.physics.add.sprite(x, y, enemyPrototype.key) as Phaser.Physics.Arcade.Sprite;
    enemy.setData('speed', enemyPrototype.speed);
    return enemy;
  }
  return null;
}

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
  
    // Initialize enemy ships group
    this.enemyShips = this.physics.add.group();
    
    // Create fast enemies
    for (let i = 0; i < 5; i++) {
      const enemy = createEnemy(this, 100 + i * 100, 100, "fast");
      if (enemy) {
        this.enemyShips.add(enemy);
      }
    }
    
    // Create slow enemies
    for (let i = 0; i < 5; i++) {
      const enemy = createEnemy(this, 200 + i * 100, 200, "slow");
      if (enemy) {
        this.enemyShips.add(enemy);
      }
    }
  
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
        let typedEnemy = enemy as Phaser.Physics.Arcade.Sprite;
        const speed = typedEnemy.getData('speed');
        typedEnemy.x += speed;
        if (typedEnemy.x > 800) {
          typedEnemy.x = -100;
        }
      }
      return null;
    });

    // Reset the ship if it goes beyond the top edge of the screen
    if (this.isShipLaunched && this.ship && this.ship.y < 0) {
      this.resetShip();
    }

    if (this.fire?.isDown && !this.isShipLaunched && this.ship) {
      this.isShipLaunched = true;
      this.ship.setVelocity(0, -200);  // Added velocity setting for ship
    }
  }

  private resetShip() {
    this.ship?.setPosition(320, 400);
    this.ship?.setVelocity(0, 0);
    this.isShipLaunched = false;
  }

  private handleCollision(ship: Phaser.Physics.Arcade.Sprite, enemy: Phaser.Physics.Arcade.Sprite) {
    // Reset ship to original position
    this.resetShip();
    // Reset ship to original position
    ship.setPosition(320, 400);
    ship.setVelocity(0, 0);
    this.isShipLaunched = false;
  
    // Destroy the enemy
    enemy.destroy();
  }
}
