import { Signal } from "typed-signals";
import { IRenderer, Container } from "pixi.js";
import { ILayoutConfig } from "./layout-config.interface";
import { Math2 } from "../math/math2";
import { AbstractService } from "../services/abstract-service";

export class Layout extends AbstractService {
  public static readonly key: string = "Layout";

  public readonly onResize = new Signal();

  protected _screenWidth: number = 100;
  protected _screenHeight: number = 100;
  protected _dpi: number = 1;
  protected _width: number = 100;
  protected _height: number = 100;
  protected _baseWidth: number = 100;
  protected _baseHeight: number = 100;
  protected _aspect: number = 1;
  protected _aspectInv: number = 1;
  protected _scale: number = 1;
  protected _scaleInv: number = 1;
  protected _isPortrait: boolean = true;
  protected _isLandscape: boolean = false;
  protected _topOffset: number = 0;
  protected _leftOffset: number = 0;
  protected container: Container;
  protected renderer: IRenderer;
  protected longSide: number;
  protected shortSide: number;

  constructor() {
    super(Layout.key)
  }

  public init(config: ILayoutConfig): void {
    this.container = config.container;
    this.renderer = config.renderer;
    this.longSide = config.longSide;
    this.shortSide = config.shortSide;

    this.setupEvents();
  }

  public get screenWidth(): number {
    return this._screenWidth;
  }

  public get screenHeight(): number {
    return this._screenHeight;
  }

  public get dpi(): number {
    return this._dpi;
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public get baseWidth(): number {
    return this._baseWidth;
  }

  public get baseHeight(): number {
    return this._baseHeight;
  }

  public get aspect(): number {
    return this._aspect;
  }

  public get aspectInv(): number {
    return this._aspectInv;
  }

  public get scale(): number {
    return this._scale;
  }

  public get scaleInv(): number {
    return this._scaleInv;
  }

  public get topOffset(): number {
    return this._topOffset;
  }

  public get leftOffset(): number {
    return this._leftOffset;
  }

  public get isPortrait(): boolean {
    return this._isPortrait;
  }

  public get isLandscape(): boolean {
    return this._isLandscape;
  }

  public LP<A, B>(landscape: A, portrait: B): A | B {
    return this._isPortrait ? portrait : landscape;
  }

  public PL<A, B>(portrait: A, landscape: B): A | B {
    return this._isPortrait ? portrait : landscape;
  }

  public updateSize(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const dpi = window.devicePixelRatio;
    this._screenWidth = screenWidth;
    this._screenHeight = screenHeight;
    this._dpi = dpi;

    this.renderer.resize(screenWidth, screenHeight);

    const isPortrait = screenWidth < screenHeight;
    this._isPortrait = isPortrait;
    this._isLandscape = !isPortrait;

    const aspect = screenWidth / screenHeight;
    const aspectInv = 1 / aspect;
    this._aspect = aspect;
    this._aspectInv = aspectInv;

    const baseWidth = this.LP(this.longSide, this.shortSide);
    const baseHeight = this.PL(this.longSide, this.shortSide);
    this._baseWidth = baseWidth;
    this._baseHeight = baseHeight;

    const viewWidth = baseHeight * aspect;
    const viewHeight = baseWidth * aspectInv;

    const scaleX = viewWidth / screenWidth;
    const scaleY = viewHeight / screenHeight;
    const scale = Math2.max(scaleX, scaleY);
    const scaleInv = 1 / scale;
    this._scale = scale;
    this._scaleInv = scaleInv;

    const width = screenWidth * scale;
    const height = screenHeight * scale;
    this._width = width;
    this._height = height;

    const topOffset = (height - baseHeight) * 0.5;
    const leftOffset = (width - baseWidth) * 0.5;
    this._topOffset = topOffset;
    this._leftOffset = leftOffset;

    const container = this.container;
    container.scale.set(scaleInv);

    this.onResize.emit();
  }

  public reset(): void {
    this.onResize.disconnectAll();
  }

  protected setupEvents(): void {
    window.onresize = () => this.updateSize();
  }
}
