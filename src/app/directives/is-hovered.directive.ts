import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appIsHovered]'
})
export class IsHoveredDirective {

  constructor() { }

  @Output() hoverChange = new EventEmitter<boolean>();

  @HostListener("mouseenter")
  onMouseEnter() {
    this.hoverChange.emit(true);
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.hoverChange.emit(false);
  }
}
