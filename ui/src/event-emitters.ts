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
  SupportedEvents extends EventMap
  // Type
> extends GameObjects.Group {
  /**
   * Members of this group.
   */
  declare children: Phaser.Structs.Set<Phaser.GameObjects.Image>;

  /**
 * All members of the group.
 */
  getChildren(): Phaser.GameObjects.Image[] {
    return super.getChildren() as Phaser.GameObjects.Image[];
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
