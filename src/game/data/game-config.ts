export const GameConfig = {
  DebugView: false,
  IsLearning: false,
  CanvasId: "game",
  LayoutLongSide: 960,
  LayoutShortSide: 640,
  UnitSize: 1,
  WorldSize: 500,
  WorldViewSize: 700,
  ViewScale: -1, // will be calculated below
  ChildSpeed: 4,
  ParentSpeed: 2,
  TicksPerAction: 5,
  StepsPerTick: 1,
  LearningSpeed: 3, // 0-9
  NormalCondition: 100,
  RoundTime: 60,
  CatchDistance: 10,
  MoveAwaySpeedMin: 3,
  MoveAwaySpeedMax: 15,
  UseLoadedBrain: true,
};

GameConfig.ViewScale = GameConfig.WorldViewSize / GameConfig.WorldSize;

if (GameConfig.IsLearning) {
  GameConfig.StepsPerTick = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000][GameConfig.LearningSpeed];
}
