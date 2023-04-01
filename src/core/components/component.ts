import { IComponent } from "./component.interface";

export class Component implements IComponent {
  public readonly type: string;

  constructor(type: string) {
    this.type = type;
  }
}
