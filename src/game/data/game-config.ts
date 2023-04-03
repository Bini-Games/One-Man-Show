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
  ChildSpeed: 4,
  ParentSpeed: 1,
  TicksPerAction: 10,
  NormalCondition: 100,
  RoundTime: 60.1,
};

GameConfig.ViewScale = GameConfig.WorldViewSize / GameConfig.WorldSize;
