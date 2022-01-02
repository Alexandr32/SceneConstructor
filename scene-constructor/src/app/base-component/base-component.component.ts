import {Subject} from "rxjs";

export abstract class BaseComponent {

  protected ngUnsubscribe: Subject<void> = new Subject<void>()

  unsubscribe(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

}
