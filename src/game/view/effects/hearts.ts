import { Emitter } from "@pixi/particle-emitter";
import { Assets, Container } from "pixi.js";
import { BaseEffect } from "./base-effect";

export class Hearts extends BaseEffect {
  protected initEmitter(): void {
    this.emitter = new Emitter(this.container, {
      lifetime: {
        min: 0.5,
        max: 0.5,
      },
      frequency: 0.1,
      emitterLifetime: 0.31,
      maxParticles: 10,
      addAtBack: false,
      pos: {
        x: 0,
        y: 0,
      },
      behaviors: [
        {
          type: "alpha",
          config: {
            alpha: {
              list: [
                {
                  time: 0,
                  value: 0.8,
                },
                {
                  time: 1,
                  value: 0.1,
                },
              ],
            },
          },
        },
        {
          type: "moveSpeed",
          config: {
            speed: {
              list: [
                {
                  time: 0,
                  value: 200,
                },
                {
                  time: 1,
                  value: 100,
                },
              ],
            },
          },
        },
        {
          type: "rotationStatic",
          config: {
            min: 0,
            max: 360,
          },
        },
        {
          type: "scale",
          config: {
            scale: {
              list: [
                {
                  time: 0,
                  value: 1,
                },
                {
                  time: 1,
                  value: 0.3,
                },
              ],
            },
            minMult: 1,
          },
        },
        {
          type: "textureSingle",
          config: {
            texture: Assets.cache.get("effects:heart"),
          },
        },
        {
          type: "spawnShape",
          config: {
            type: "torus",
            data: {
              x: 0,
              y: 0,
              radius: 10,
              innerRadius: 0,
              affectRotation: false,
            },
          },
        },
      ],
    });
  }
}
