import { IComponent } from "./component.interface";

export type ComponentCallback<Component extends IComponent> = (
  component: Component
) => void;

export interface IEntity<Component extends IComponent> {
  addComponent(component: Component): void;
  removeComponent(component: Component): void;
  getComponent(type: string): Component | null;
  forEachComponent(callback: ComponentCallback<Component>, ctx?: any): void;
  hasComponent(component: Component): boolean;
}
