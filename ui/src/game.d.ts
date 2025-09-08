type RegistryData = {
  isBgMusicEnabled: boolean;
};

type RegistryDataManager = Omit<Phaser.Data.DataManager, "get" | "set"> & {
  get<K extends keyof RegistryData>(key: K): RegistryData[K];
  set<K extends keyof RegistryData>(key: K, value: RegistryData[K]): void;
}

// declare module "phaser" {
//   // namespace GameObjects {
//   //   interface Group {
//   //     getChildren<T = Phaser.GameObjects.GameObject>(): T[];
//   //   }
//   // }

//   namespace Phaser {
//     class Scene {
//       registry: RegistryDataManager;
//     }
//   }
// }

// Create a typed Scene class that properly overrides the registry property
// export class TypedScene extends Phaser.Scene {
//   declare registry: RegistryDataManager;
// }