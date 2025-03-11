import { Scene } from "phaser";

const level = [
  [1, 0, 3],
  [2, 4, 1],
  [3, 4, 2],
];

const opened = "opened";
const closed = "closed";

export class Game extends Scene {
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type{Phaser.Physics.Arcade.StaticGroup} */
  boxGroup;

  /** @type{Phaser.Physics.Arcade.Sprite | undefined} */
  activeBox;

  /** @type{Phaser.GameObjects.Group} */
  itemsGroup;

  /** @type {Phaser.Physics.Arcade.Sprite[]} */
  spritesToDepthSort;

  /** @type {{ box: Phaser.Physics.Arcade.Sprite, item: Phaser.GameObjects.Sprite}[]} */
  selectedBoxes;

  /**@type{number} */
  matchesCount;

  constructor() {
    super("game");
    this.spritesToDepthSort = [];
    this.selectedBoxes = [];
    this.matchesCount = 0;
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
      .setData("tag", "player")
      .play("down-idle");
    this.spritesToDepthSort.push(this.player);

    this.boxGroup = this.physics.add.staticGroup();

    this.createBoxes();

    this.itemsGroup = this.add.group();

    this.physics.add.collider(
      this.player,
      this.boxGroup,
      this.handlePlayerBoxCollide,
      undefined,
      this
    );
  }

  handlePlayerBoxCollide(player, box) {
    if (this.activeBox || box.getData("state") === opened) {
      return;
    }

    this.activeBox = box;

    this.activeBox?.setFrame(9);
  }

  updatePlayer() {
    if (!this.player.active) {
      return;
    }

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

    const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space);
    if (spaceJustPressed) {
      this.openBox(this.activeBox);
    }
  }

  /**
   *
   * @param {Phaser.Physics.Arcade.Sprite | undefined} box
   */
  openBox(box) {
    if (!box) {
      return;
    }

    box.setData("state", opened);

    const itemType = box.getData("itemType");

    /** @type{Phaser.GameObjects.Sprite | null} */
    let item = null;

    switch (itemType) {
      case 0:
        item = this.itemsGroup.get(box.x, box.y);
        item?.setTexture("bear");
        break;

      case 1:
        item = this.itemsGroup.get(box.x, box.y);
        item?.setTexture("chicken");
        break;

      case 2:
        item = this.itemsGroup.get(box.x, box.y);
        item?.setTexture("duck");
        break;

      case 3:
        item = this.itemsGroup.get(box.x, box.y);
        item?.setTexture("parrot");
        break;

      case 4:
        item = this.itemsGroup.get(box.x, box.y);
        item?.setTexture("penguin");
        break;
    }

    if (!item) {
      console.error("No item to work with in openBox...");
      return;
    }

    item.setDepth(2000);

    item.scale = 0;
    item.alpha = 0;

    this.selectedBoxes.push({ box, item });

    this.tweens.add({
      targets: item,
      y: "-=50",
      alpha: 1,
      scale: 1,
      duration: 500,
      onComplete: (_tween, _targets) => {
        if (itemType === 0) {
          this.handleBearSelected();
          return;
        }

        if (this.selectedBoxes.length < 2) {
          return;
        }

        this.checkForMatch();
      },
    });

    this.activeBox?.setFrame(10);
    this.activeBox = undefined;
  }

  handleBearSelected() {
    const selectedBox = this.selectedBoxes.pop();
    if (!selectedBox) {
      throw new Error(
        "cannot handle bear selected when there is nothing selected"
      );
    }

    const { box, item } = selectedBox;

    item.setTint(0xff0000);
    box.setFrame(7);

    this.player.active = false;
    this.player.setVelocity(0, 0);

    this.time.delayedCall(1000, () => {
      item.setTint(0xffffff);
      box.setFrame(10);
      box.setData("state", closed);

      this.tweens.add({
        targets: item,
        y: "+=50",
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: (_tween, _targets) => {
          this.player.active = true;
        },
      });
    });
  }

  checkForMatch() {
    const selected1 = this.selectedBoxes.pop();
    const selected2 = this.selectedBoxes.pop();

    if (selected1?.item.texture.key !== selected2?.item.texture.key) {
      this.tweens.add({
        targets: [selected1?.item, selected2?.item],
        y: "+=50",
        alpha: 0,
        scale: 0,
        duration: 300,
        delay: 800,
        onComplete: () => {
          selected1?.box.setData("state", closed);
          selected2?.box.setData("state", closed);

          // NOTE: no need to set box frame to 10 as that would already
          // be done by openBox
        },
      });

      return;
    }

    // NOTE: past here is "match" case.

    ++this.matchesCount;

    this.time.delayedCall(800, () => {
      selected1?.box.setFrame(8);
      selected2?.box.setFrame(8);

      if (this.matchesCount >= 4) {
        this.player.active = false;
        this.player.setVelocity(0, 0);

        const { width, height } = this.scale;
        this.add
          .text(width * 0.5, height * 0.5, "You win!", {
            fontSize: 48,
          })
          .setOrigin(0.5)
          .setDepth(3000);
      }
    });
  }

  updateActiveBox() {
    if (!this.activeBox) {
      return;
    }

    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.activeBox.x,
      this.activeBox.y
    );

    if (distance < 64) {
      return;
    }

    this.activeBox.setFrame(10);
    this.activeBox = undefined;
  }

  update() {
    this.updatePlayer();

    this.updateActiveBox();

    this.spritesToDepthSort.forEach((s) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      // @ts-ignore
      const sprite = s;

      sprite.setDepth(sprite.y);
    });
  }

  createBoxes() {
    const width = this.scale.width;

    let xPer = 0.25;
    let y = 150;
    for (let row = 0; row < level.length; ++row) {
      for (let col = 0; col < level[row].length; ++col) {
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const box = this.boxGroup.get(width * xPer, y, "sokoban", 10);
        box
          .setSize(64, 32)
          .setOffset(0, 32)
          .setData("itemType", level[row][col])
          .setData("state", closed);

        this.spritesToDepthSort.push(box);

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
