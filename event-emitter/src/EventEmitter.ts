import { Events } from "phaser";

export type Event = { name: string };

export class EventEmitter<T extends Event> extends Events.EventEmitter {
  //   emit(event: T["name"], ...args: any[]): boolean {
  emit(event: T["name"], args?: Omit<T, "name">): boolean {
    return super.emit(event, args);
  }

  on(
    event: T["name"],
    fn: (props: Omit<T, "name">) => void,
    context?: any
  ): this {
    return super.on(event, fn, context);
  }
}
