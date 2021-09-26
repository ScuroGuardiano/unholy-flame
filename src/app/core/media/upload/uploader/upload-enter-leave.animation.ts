import { style, transition, trigger, animate, sequence, group } from "@angular/animations";

const uploadEnterLeaveAnimation = trigger('uploadEnterLeave', [
  //transition(':enter', [ style({ height: '0px', opacity: 0 }), animate(100, style({ height: '*' })), animate(300, style({ opacity: '*' })) ]),
  transition(':leave', [
    sequence([
      animate(150, style({ opacity: 0 })),
      animate(300, style({ height: '0px' }))
    ])
  ])
]);

export default uploadEnterLeaveAnimation;
