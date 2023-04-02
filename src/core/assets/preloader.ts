import { Assets } from "pixi.js";
import { Game } from "../facade/game";
import { LoadingState } from "./loading-state.enum";

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
