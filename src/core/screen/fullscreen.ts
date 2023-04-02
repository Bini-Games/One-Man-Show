import { GameConfig } from "../../game/data/game-config";
import { Game } from "../facade/game";

export async function requestFullscreen(): Promise<void> {
  const documentElement: any = document.getElementById(GameConfig.CanvasId);

  try {
    if(documentElement.requestFullscreen) {
      await documentElement.requestFullscreen();
    } else if(documentElement.mozRequestFullScreen) {
      await documentElement.mozRequestFullScreen();
    } else if(documentElement.webkitRequestFullscreen) {
      await documentElement.webkitRequestFullscreen();
    } else if(documentElement.msRequestFullscreen) {
      await documentElement.msRequestFullscreen();
    }
  } catch (e) {
    Game.logger.log(`Couldn't start full screen mode`);
  }
}
