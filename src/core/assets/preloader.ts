import { Assets } from "pixi.js";
import { Game } from "../facade/game";
import { LoadingState } from "./loading-state.enum";
import { sound } from "@pixi/sound";

export class Preloader {
  protected loadedCb: Function;
  protected state: LoadingState = LoadingState.Ready;
  protected pixiAssetsLoaded: boolean = false;

  public subscribeOnLoaded(cb: Function): this {
    this.loadedCb = cb;
    return this;
  }

  public start(): this {
    if (this.state === LoadingState.Ready) {
      this.startPIXILoader();
      this.loadSounds();
    }

    return this;
  }

  public enqueue(assetsData: Record<string, string>): this {
    if (this.state === LoadingState.Ready) {
      Assets.addBundle("assets", assetsData);
    }

    return this;
  }

  protected startPIXILoader(): void {
    this.state = LoadingState.Loading;
    
    Assets
      .loadBundle("assets")
      .then(() => this.onPIXIAssetsLoaded());
  }

  protected loadSounds(): void {
    sound.add("bg", "assets/sounds/bg.wav");
    sound.add("crack", "assets/sounds/crack.wav");
    sound.add("magic", "assets/sounds/magic.flac");
    sound.add("walk", "assets/sounds/walk.mp3");
  }

  protected onPIXIAssetsLoaded(): void {
    Game.logger.log("Assets have been loaded successfully.");
    this.pixiAssetsLoaded = true;
    this.checkIfLoaded();
  }

  protected checkIfLoaded(): void {
    if (this.pixiAssetsLoaded) {
      this.onLoaded();
    }
  }

  protected onLoaded(): void {
    this.state = LoadingState.Loaded;
    this.loadedCb?.();
  }

  protected fail(): void {
    this.state = LoadingState.Failed;
  }
}
