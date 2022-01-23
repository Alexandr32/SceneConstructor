import {Directive, ViewContainerRef} from '@angular/core';

// Перекинул core
@Directive({
  selector: '[appRef]'
})
export class RefDirective {

  constructor(public containerRef: ViewContainerRef) { }

}
