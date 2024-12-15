import { Component, Prop, State, h } from "@stencil/core";
import DragSelect from "dragselect";
import { moveInRadiusBoundary } from "../../utils/utils";

@Component({
  tag: "rail-switch",
  styleUrl: "rail-switch.css",
  shadow: true,
})
export class RailSwitch {
  @Prop() styles = {
    track: "goldenrod",
    target: {
      left: "red",
      actor: "rgba(0,0,0,0.5)",
      right: "green",
    },
  };

  @State() pos: { x: number; y: number } = { x: 0, y: 1 };
  dsRef: DragSelect<HTMLElement> = null;
  dragSwitchRef: HTMLElement = null;

  constructor() {}

  componentDidLoad() {
    if (!this.dragSwitchRef) {
      throw ReferenceError("dragSwitchRef is not defined");
    }

    console.log(this.dragSwitchRef);
    this.dsRef = new DragSelect({
      selectables: this.dragSwitchRef,
      keyboardDrag: false, // TODO handled natively
    });

    /** set custom boundary logic */
    this.dsRef.subscribe(
      "DS:update:pre",
      ({
        items,
        event,
        isDragging,
      }: {
        items: HTMLElement[];
        event: MouseEvent;
        isDragging: boolean;
      }) => {
        // lib doesn't export types so have to do it manually

        if (!isDragging || !items.length) {
          console.warn("tried to drag?");
          return; // JIC
        }

        const switchEl = items[0];
        this.dsRef.break();
        moveInRadiusBoundary(switchEl, event, 90);
      }
    );

    /** release item on drag:end */
    this.dsRef.subscribe("DS:end", (e) => {
      e.items.forEach((i: HTMLElement) => {
        this.dsRef.removeSelection(i);
      });
    });
  }

  render() {
    return (
      <div id="rail-switch-container">
        <div id="background-track" style={{ borderColor: this.styles.track }} />

        <div
          id="drag-switch-container"
          class="drag-target-container"
          ref={(el) => (this.dragSwitchRef = el as HTMLElement)}
        >
          <div style={{ backgroundColor: this.styles.target.actor }} />
        </div>
        <div id="left-target" class="drag-target-container">
          <div style={{ backgroundColor: this.styles.target.left }} />
        </div>
        <div id="right-target" class="drag-target-container">
          <div style={{ backgroundColor: this.styles.target.right }} />
        </div>
      </div>
    );
  }
}
