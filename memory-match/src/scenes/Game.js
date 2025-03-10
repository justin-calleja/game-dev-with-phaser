import { Scene } from "phaser";

export class Game extends Scene {
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type{Phaser.Physics.Arcade.StaticGroup} */
  boxGroup;

  constructor() {
    super("game");
  }

  init() {
    this.cursors =
      /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
      (this.input.keyboard?.createCursorKeys());
  }

  create() {
    const { width, height } = this.scale;

    // this.add.sprite(400, 300, "sokoban", 52).play("down-walk");
    this.player = this.physics.add
      .sprite(width * 0.5, height * 0.6, "sokoban")
      .setSize(40, 16)
      .setOffset(12, 38)
      .play("down-idle");
    console.log(this.player);

    this.boxGroup = this.physics.add.staticGroup();

    this.createBoxes();

    this.physics.add.collider(this.player, this.boxGroup);
  }

  update() {
    const speed = 200;
    let velocityX = 0;
    let velocityY = 0;

    // Get directional input
    if (this.cursors.left.isDown) velocityX = -1;
    if (this.cursors.right.isDown) velocityX = 1;
    if (this.cursors.up.isDown) velocityY = -1;
    if (this.cursors.down.isDown) velocityY = 1;

    // Normalize movement (prevents faster diagonal speed)
    const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (length !== 0) {
      // Avoid division by zero
      velocityX = (velocityX / length) * speed;
      velocityY = (velocityY / length) * speed;
    }

    this.player.setVelocity(velocityX, velocityY);

    // Determine animation direction
    if (length !== 0) {
      if (velocityY < 0) {
        this.player.play("up-walk", true);
      } else if (velocityY > 0) {
        this.player.play("down-walk", true);
      } else if (velocityX < 0) {
        this.player.play("left-walk", true);
      } else if (velocityX > 0) {
        this.player.play("right-walk", true);
      }
    } else {
      // Stop movement and play idle animation
      this.player.setVelocity(0, 0);
      const key = this.player.anims.currentAnim?.key;
      const parts = key?.split("-");
      const direction = parts?.[0];
      this.player.play(`${direction}-idle`);
    }

    this.children.each((c) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      // @ts-ignore
      const child = c;

      child.setDepth(child.y);
    });
  }

  createBoxes() {
    const width = this.scale.width;

    let xPer = 0.25;
    let y = 150;
    for (let row = 0; row < 3; ++row) {
      for (let col = 0; col < 3; ++col) {
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const box = this.boxGroup.get(width * xPer, y, "sokoban", 10);
        box.setSize(64, 32).setOffset(0, 32);

        xPer += 0.25;
      }

      xPer = 0.25;
      y += 150;
    }
  }

  //   update() {
  //     const speed = 200;

  //     if (this.cursors.left.isDown) {
  //       this.player.setVelocity(-speed, 0);
  //       this.player.play("left-walk", true);
  //     } else if (this.cursors.right.isDown) {
  //       this.player.setVelocity(speed, 0);
  //       this.player.play("right-walk", true);
  //     } else if (this.cursors.up.isDown) {
  //       this.player.setVelocity(0, -speed);
  //       this.player.play("up-walk", true);
  //     } else if (this.cursors.down.isDown) {
  //       this.player.setVelocity(0, speed);
  //       this.player.play("down-walk", true);
  //     } else {
  //       this.player.setVelocity(0, 0);
  //       const key = this.player.anims.currentAnim?.key;
  //       const parts = key?.split("-");
  //       const direction = parts?.[0];
  //       this.player.play(`${direction}-idle`);
  //     }
  //   }
}
