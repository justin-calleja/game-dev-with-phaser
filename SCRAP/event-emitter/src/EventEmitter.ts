// import { Events } from "phaser";

import { Events } from "phaser";

// export type Event = { name: string };

// export class EventEmitter<T extends Event> extends Events.EventEmitter {
//   emit(event: T["name"], args?: Omit<T, "name">): boolean {
//     return super.emit(event, args);
//   }

//   on(
//     event: T["name"],
//     fn: (props: Omit<T, "name">) => void,
//     context?: any
//   ): this {
//     return super.on(event, fn, context);
//   }
// }

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
    return super.emit(event as string, ...args);
  }

  on<K extends keyof SupportedEvents>(
    event: K,
    fn: (...args: SupportedEvents[K]) => void,
    context?: any
  ): this {
    return super.on(event as string, fn, context);
  }
}

// export interface IEventEmitter<SupportedEvent extends EventMap> {
//   emit<K extends keyof SupportedEvent>(
//     event: K,
//     ...args: SupportedEvent[K]
//   ): boolean;

//   on<K extends keyof SupportedEvent>(
//     event: K,
//     fn: (...args: SupportedEvent[K]) => void,
//     context?: any
//   ): this;
// }
