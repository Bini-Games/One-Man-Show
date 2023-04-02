import { AbstractService } from "../../core/services/abstract-service";
import { UI } from "./ui";

export class UIService extends AbstractService {
  public static readonly key: string = "UIService";
  public readonly ui: UI;

  constructor(ui: UI) {
    super(UIService.key);

    this.ui = ui;
  }
}
