import {Component} from '@angular/core';
import {transition, trigger, query, style, animate, group, animateChild} from '@angular/animations';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter', [
          style({
             position: 'absolute',
             top: 0,
             right: 0,
             width: '100%'
          })
        ], {optional: true}),
        query(':enter', [
          style({ right: '-100%'})
        ], {optional: true}),
        // query(':leave', animateChild()),
        group([
          // query(':leave', [
          //   animate('200ms ease-out', style({ right: '100%'}))    , :leave
          // ]),
          query(':enter', [
            animate('300ms ease-out', style({ right: '0%'}))
          ], {optional: true})
        ]),
        query(':enter', animateChild(), {optional: true}),
      ])
    ])
   ]
})
export class AppComponent {
  title = 'Detect Lesion';
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
