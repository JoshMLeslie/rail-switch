import { Component, Prop, h } from "@stencil/core";
import DragSelect from "dragselect";
import { isOnTarget, moveInRadiusBoundary } from "../../utils/utils";

@Component({
  tag: "rail-switch",
  styleUrl: "rail-switch.css",
  shadow: true,
})
export class RailSwitch {
  @Prop() onDrop: (side: "left" | "right") => any = console.log;
  @Prop() doFlash = true;
  @Prop() styles = {
    track: "goldenrod",
    targets: {
      left: "red",
      switch: "gray",
      switchFlash: "slategray",
      right: "green",
    },
  };

  dsRef: DragSelect<HTMLElement> = null;

  switchContainerRef: HTMLElement = null;
  dragSwitchRef: HTMLElement = null;
  leftTargetRef: HTMLElement = null;
  rightTargetRef: HTMLElement = null;

  componentDidLoad() {
    if (!this.switchContainerRef) {
      throw ReferenceError("container ref is not defined!");
    }

    this.dsRef = new DragSelect({
      area: this.switchContainerRef, // isolates listener to container
      selectables: this.dragSwitchRef,
      keyboardDrag: false, // TODO handled natively
    });

    /** set custom boundary logic */
    this.dsRef.subscribe("DS:update:pre", this._handleMovement);

    this.dsRef.subscribe("DS:end", this._handleDrop);
  }

  disconnectedCallback() {
    this.dsRef.unsubscribe("DS:update:pre", this._handleMovement);
    this.dsRef.unsubscribe("DS:end", this._handleDrop);
  }

  private _reset = async (): Promise<void> => {
    const anim = this.dragSwitchRef.parentElement.animate(
      {
        transform: "rotate(0deg)",
      },
      {
        duration: 500,
        easing: "ease-in-out",
      }
    );
    return anim.finished.then(() => {
      this.dragSwitchRef.parentElement.style.transform = "rotate(0deg)";
    });
  };

  private _handleMovement = ({
    items,
    event,
    isDragging,
  }: {
    items: HTMLElement[];
    event: MouseEvent;
    isDragging: boolean;
  }) => {
    if (!isDragging || !items.length) {
      return;
    }

    this.dsRef.break();
    // move the parent since that's the rotation-offset-element
    moveInRadiusBoundary(this.dragSwitchRef.parentElement, event);
  };

  private async _doFlash(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.dragSwitchRef.style.backgroundColor =
        this.styles.targets.switchFlash;
      setTimeout(() => {
        this.dragSwitchRef.style.backgroundColor = this.styles.targets.switch;
        resolve();
      }, 500);
    });
  }

  private _handleDrop = async () => {
    /** force release item on drag:end */
    this.dsRef.removeSelection(this.dragSwitchRef);

    let targetSelected: "left" | "right";
    if (isOnTarget(this.dragSwitchRef, this.leftTargetRef)) {
      targetSelected = "left";
    }
    if (isOnTarget(this.dragSwitchRef, this.rightTargetRef)) {
      targetSelected = "right";
    }

    if (targetSelected) {
      console.debug("dropped on", targetSelected);
      this.onDrop(targetSelected);
      if (this.doFlash) {
        await this._doFlash();
      }
    }

    this._reset();
  };

  render() {
    return (
      <div
        id="rail-switch-container"
        ref={(el) => (this.switchContainerRef = el)}
      >
        <div id="background-track" style={{ borderColor: this.styles.track }} />
        <div id="left-target-container" class="drag-target-container">
          <div
            id="left-target"
            style={{ backgroundColor: this.styles.targets.left }}
            ref={(el) => (this.leftTargetRef = el)}
          />
        </div>
        <div id="right-target-container" class="drag-target-container">
          <div
            id="right-target"
            style={{ backgroundColor: this.styles.targets.right }}
            ref={(el) => (this.rightTargetRef = el)}
          />
        </div>
        <div id="drag-switch-container" class="drag-target-container">
          <div
            id="drag-switch"
            style={{ backgroundColor: this.styles.targets.switch }}
            ref={(el) => (this.dragSwitchRef = el)}
          />
        </div>
      </div>
    );
  }
}
