import * as Matter from "matter-js";

export type BodyFactory = () => Matter.Body;

export const BodyFactories = {
  Circle: (radius: number, options?: Matter.IBodyDefinition) => {
    return () => Matter.Bodies.circle(0, 0, radius, options);
  },
  Rectangle: (width: number, height: number, options?: Matter.IBodyDefinition) => {
    return () => Matter.Bodies.rectangle(0, 0, width, height, options);
  },
};
