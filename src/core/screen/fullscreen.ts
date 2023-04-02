import { GameConfig } from "../../game/data/game-config";

export function requestFullscreen(): void {
  const documentElement: any = document.getElementById(GameConfig.CanvasId);

  if(documentElement.requestFullscreen) {
    documentElement.requestFullscreen();
  } else if(documentElement.mozRequestFullScreen) {
    documentElement.mozRequestFullScreen();
  } else if(documentElement.webkitRequestFullscreen) {
    documentElement.webkitRequestFullscreen();
  } else if(documentElement.msRequestFullscreen) {
    documentElement.msRequestFullscreen();
  }
}
