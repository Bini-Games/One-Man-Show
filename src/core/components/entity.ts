import * as assert from "typed-assert";
import { IComponent } from "./component.interface";
import { Component } from "./component";
import { ComponentCallback, IEntity } from "./entity.interface";
import { IDestroyable } from "../abstractions/destroyable.interface";
import { MemoryUtils } from "../utils/memory-utils";

export class Entity<ComponentType extends IComponent = Component>
  implements IEntity<ComponentType>, IDestroyable
{
  protected components: ComponentType[] = [];

  public addComponent(component: ComponentType): void {
    assert.isNotVoid(component);
    this.components.push(component);
  }

  public removeComponent(component: ComponentType): void {
    assert.isNotVoid(component);

    const components = this.components;
    const count = components.length;

    for (let i = 0; i < count; ++i) {
      if (components[i] === component) {
        components.splice(i, 1);
        return;
      }
    }
  }

  public getComponent(type: string): ComponentType | null {
    assert.isString(type);

    const components = this.components;
    const count = components.length;

    for (let i = 0; i < count; ++i) {
      if (components[i].type === type) {
        return components[i];
      }
    }

    return null;
  }

  public forEachComponent(
    callback: ComponentCallback<ComponentType>,
    ctx?: any
  ): void {
    assert.assert(typeof callback === "function");

    const components = this.components;
    const count = components.length;

    for (let i = 0; i < count; ++i) {
      callback.call(ctx, components[i]);
    }
  }

  public hasComponent(component: ComponentType): boolean {
    assert.isNotVoid(component);
    return this.components.indexOf(component) !== -1;
  }

  public destroy(): void {
    MemoryUtils.destroyMany(this.components);
    this.components = null;
  }
}
