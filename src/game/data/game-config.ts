export const GameConfig = {
  DebugView: true,
  IsLearning: true,
  CanvasId: "game",
  LayoutLongSide: 960,
  LayoutShortSide: 640,
  UnitSize: 1,
  WorldSize: 500,
  WorldViewSize: 700,
  ViewScale: -1, // will be calculated below
  ChildSpeed: 2,
  ParentSpeed: 1,
  TicksPerAction: 10,
};

GameConfig.ViewScale = GameConfig.WorldViewSize / GameConfig.WorldSize;
