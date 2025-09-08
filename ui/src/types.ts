export type AssetKey =
  | "mainmenu/inner-panel"
  | "mainmenu/outer-panel"
  | "mainmenu/primary-button"
  | "mainmenu/secondary-button";

export type RegistryData = {
  isBgMusicEnabled: boolean;
};

export type RegistryDataManager = Omit<Phaser.Data.DataManager, "get" | "set"> & {
  get<K extends keyof RegistryData>(key: K): RegistryData[K];
  set<K extends keyof RegistryData>(key: K, value: RegistryData[K]): RegistryDataManager;
}

// registry: Phaser.Data.DataManager;
