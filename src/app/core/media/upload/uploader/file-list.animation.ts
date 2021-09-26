import { style, trigger, transition, query, stagger, animate } from "@angular/animations";

const initialFileListElementStyle = style({ opacity: 0 });

// Can't use borderWidth here nor margin coz on Firefox it won't work XD
// Ahh Firefox, I fucking love Firefox
const leaveFileListElementStyle = style({
  width: '0px',
  minWidth: '0px',
  opacity: 0,
  overflow: 'hidden',
  borderLeftWidth: '0px',
  borderRightWidth: '0px',
  marginLeft: '-0.5rem',
  marginRight: 0
});

const fileListAnimation = trigger('fileListAnimation', [
  transition("* <=> *", [
    query(":enter", [
      initialFileListElementStyle,
      stagger('50ms', [
        animate('400ms ease-in-out')
      ])
    ], { optional: true }),
    query(":leave", [
      stagger('50ms', [
        animate('300ms ease-in-out', leaveFileListElementStyle)
      ])
    ], { optional: true })
  ])
])


export default fileListAnimation;
