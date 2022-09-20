// import {OnDestroy, OnInit} from '@angular/core'
// import {MediaObserver} from '@angular/flex-layout'
// import {Subscription} from 'rxjs'
//
// export class MobileService implements OnInit, OnDestroy {
//   constructor(private mediaObserver: MediaObserver) {
//   }
//
//   private mediaSubscription!: Subscription;
//   private activeMediaQuery = '';
//
//   ngOnInit(): void {
//     this.mediaSubscription = this.mediaObserver
//       .asObservable()
//       .subscribe((change) => {
//         change.forEach((item) => {
//           this.activeMediaQuery = item
//             ? `'${item.mqAlias}' = (${item.mediaQuery})`
//             : '';
//           if (item.mqAlias === 'xs') {
//             this.loadMobileContent();
//           }
//           console.log('activeMediaQuery', this.activeMediaQuery);
//         });
//       });
//   }
//
//   loadMobileContent() {
//     // Do something special since the viewport is currently
//     // using mobile display sizes.
//   }
//
//   ngOnDestroy(): void {
//     this.mediaSubscription.unsubscribe();
//   }
// }
