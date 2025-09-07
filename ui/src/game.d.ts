declare module "phaser" {
  namespace GameObjects {
    interface Group {
      getChildren<T = Phaser.GameObjects.GameObject>(): T[];
    }
  }
}