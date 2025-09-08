// https://blog.ourcade.co/posts/2021/character-logic-state-machine-typescript/

export interface IState<T extends string> {
  name: T;
  onEnter?: () => void;
  onUpdate?: (dt: number) => void;
  onExit?: () => void;
}

let idCount = 0;

export class StateMachine<T extends string> {
  protected states = new Map<T, IState<T>>();
  protected currentState?: IState<T>;
  protected isChangingState = false;
  protected changeStateQueue: T[];

  protected id = (++idCount).toString();
  protected context?: object;

  constructor(context?: object, id?: string) {
    this.id = id ?? this.id;
    this.context = context;
  }

  addState(state: IState<T>) {
    this.states.set(state.name, {
      name: state.name,
      onEnter: state.onEnter?.bind(this.context),
      onUpdate: state.onUpdate?.bind(this.context),
      onExit: state.onExit?.bind(this.context),
    });

    return this;
  }

  isCurrentState(name: T) {
    return this.currentState?.name === name;
  }

  getCurrentStateName(): T | undefined {
	return this.currentState?.name;
  }

  setState(name: T) {
    const nextState = this.states.get(name);

    if (!nextState) {
      console.warn(`Tried to change to unknown state: ${nextState}`);
      return;
    }

    if (this.isCurrentState(name)) {
      return;
    }

    if (this.isChangingState) {
      this.changeStateQueue.push(name);
      return;
    }

    this.isChangingState = true;

    console.log(
      `[StateMachine (${this.id})] change from ${
        this.currentState?.name ?? "none"
      } to ${name}`
    );

    this.currentState?.onExit?.();

    this.currentState = nextState;

    this.currentState.onEnter?.();

    this.isChangingState = false;
  }

  update(dt: number) {
    if (this.changeStateQueue.length > 0) {
      this.setState(this.changeStateQueue.shift()!);
      return;
    }

    this.currentState?.onUpdate?.(dt);
  }
}
