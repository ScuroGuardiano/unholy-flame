import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appResizeObserver]'
})
export class ResizeObserverDirective implements OnInit, OnDestroy {

  @Output() appResize = new EventEmitter<ResizeObserverEntry>();

  @Input() debounce: number = 0;

  subscription!: Subscription;

  constructor(
    private hostRef: ElementRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    const observable = new Observable<ResizeObserverEntry>(subscriber => {
      const observer = new ResizeObserver(entries => {
          entries.forEach(entry => subscriber.next(entry));
      });

      observer.observe(this.hostRef.nativeElement);
      return () => {
        observer.unobserve
      };
    })

    this.subscription = observable.pipe(
      debounceTime(this.debounce)
    ).subscribe(val => this.zone.run(() => this.appResize.emit(val)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
