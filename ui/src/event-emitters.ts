import { Events, GameObjects } from "phaser";

export type EventMap = {
  [event: string | symbol]: any[];
};

export class EventEmitter<
  SupportedEvents extends EventMap
> extends Events.EventEmitter {
  emit<K extends keyof SupportedEvents>(
    event: K,
    ...args: SupportedEvents[K]
  ): boolean {
    return super.emit(event as any, ...args);
  }

  on<K extends keyof SupportedEvents>(
    event: K,
    fn: (...args: SupportedEvents[K]) => void,
    context?: any
  ): this {
    return super.on(event as string, fn, context);
  }
}

export class ImageGameObject<
  SupportedEvents extends EventMap
> extends GameObjects.Image {
  emit<K extends keyof SupportedEvents>(
    event: K,
    ...args: SupportedEvents[K]
  ): boolean {
    return super.emit(event as any, ...args);
  }

  on<K extends keyof SupportedEvents>(
    event: K,
    fn: (...args: SupportedEvents[K]) => void,
    context?: any
  ): this {
    return super.on(event as string, fn, context);
  }
}

export class GroupGameObject<
  SupportedEvents extends EventMap,
  T extends Phaser.GameObjects.GameObject
> extends GameObjects.Group {
  /**
   * Members of this group.
   */
  declare children: Phaser.Structs.Set<T>;

  getChildren() {
    return super.getChildren() as T[];
  }

  emit<K extends keyof SupportedEvents>(
    event: K,
    ...args: SupportedEvents[K]
  ): boolean {
    return super.emit(event as any, ...args);
  }

  on<K extends keyof SupportedEvents>(
    event: K,
    fn: (...args: SupportedEvents[K]) => void,
    context?: any
  ): this {
    return super.on(event as string, fn, context);
  }
}
