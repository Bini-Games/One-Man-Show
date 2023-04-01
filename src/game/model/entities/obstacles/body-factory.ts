import * as Matter from "matter-js";

export type BodyFactory = () => Matter.Body;

export const BodyFactories = {
  Circle: function (radius: number, options?: Matter.IBodyDefinition) {
    return () => applyOptions(Matter.Bodies.circle(0, 0, radius, options), options);
  },
  Rectangle: function (width: number, height: number, options?: Matter.IBodyDefinition) {
    return () => applyOptions(Matter.Bodies.rectangle(0, 0, width, height, options), options);
  },
};

function applyOptions(body: Matter.Body, options?: Matter.IBodyDefinition): Matter.Body {
  if (options) {
    if (options.position) {
      Matter.Body.setPosition(body, options.position);
    }
  }
  return body;
}
