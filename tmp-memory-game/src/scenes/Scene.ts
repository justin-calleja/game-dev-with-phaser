import Phaser from "phaser";
import type { RegistryData } from "../types";

export class Scene extends Phaser.Scene {
	setInRegistry<K extends keyof RegistryData>(
		key: K,
		value: RegistryData[K],
	): void {
		this.registry.set(key, value);
	}

	getFromRegistry<K extends keyof RegistryData>(key: K): RegistryData[K] {
		const value = this.registry.get(key);
		if (value === undefined) {
			throw new Error(`Cannot get value of "${key}" before setting it`);
		}
		return value;
	}
}
