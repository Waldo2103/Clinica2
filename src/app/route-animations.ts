import { trigger, transition, style, query, group, animateChild, animate, keyframes, } from '@angular/animations'; 

export const routeTransitionAnimations = trigger('routeAnimations', [
	transition('One => Two, Two => Three, One => Three', [
		style({ position: 'relative' }),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				right: 0,
				width: '100%'
			})
		]),
		query(':enter', [style({ right: '-100%', opacity: 0 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('1s ease-out', style({ right: '100%', opacity: 0 }))]),
			query(':enter', [animate('1s ease-out', style({ right: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	]),
	transition('Three => Two, Two => One, Three => One', [
		style({ position: 'relative' }),
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%'
			})
		]),
		query(':enter', [style({ left: '-100%', opacity: 0 })]),
		query(':leave', animateChild()),
		group([
			query(':leave', [animate('1s ease-out', style({ left: '100%', opacity: 0 }))]),
			query(':enter', [animate('1s ease-out', style({ left: '0%', opacity: 1 }))])
		]),
		query(':enter', animateChild())
	])
]);

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('PrincipalPage <=> LoginPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ],{optional:true}),
      query(':enter', [
        style({ left: '-100%'})
      ],{optional:true}),
      query(':leave', animateChild(),{optional:true}),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%'}))
        ],{optional:true}),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ],{optional:true})
      ]),
      query(':enter', animateChild(),{optional:true}),
    ]),
    transition('* <=> LoginPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ],{optional:true}),
      query(':enter', [
        style({ left: '-100%'})
      ],{optional:true}),
      query(':leave', animateChild(),{optional:true}),
      group([
        query(':leave', [
          animate('200ms ease-out', style({ left: '100%'}))
        ],{optional:true}),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ],{optional:true})
      ]),
      query(':enter', animateChild(),{optional:true}),
    ])
  ]);

// Basic 
export const fader = 
trigger('routeAnimations', [ 
    transition('isRight <=> isLeft', [ 
        query(':enter, :leave', [ 
            style({ 
                position: 'absolute', 
                left: 0, 
                width: '100%', 
                opacity: 0, 
                transform: 'scale(0) translateY(100%)', 
            }), 
        ],{optional:true}), 
        query(':enter', [ 
            animate('1000ms ease', 
            style({ opacity: 1, transform: 'scale(1) translateY(0)' })
            ), 
        ],{optional:true}) 
    ]),
]); 

// Positioned 
export const slider = 
trigger('routeAnimations', [ 
    transition('* => isLeft', slideTo('left') ), 
    transition('* => isRight', slideTo('right') ), 
    transition('isRight => *', slideTo('left') ), 
    transition('isLeft => *', slideTo('right') ) 
]); 

export const transformer = trigger('routeAnimations', [ 
    transition('* => isLeft', translateTo({ x: -100, y: -100, rotate: -720 }) ), 
    transition('* => isRight', translateTo({ x: 100, y: -100, rotate: 90 }) ), 
    transition('isRight => *', translateTo({ x: -100, y: -100, rotate: 360 }) ), 
    transition('isLeft => *', translateTo({ x: 100, y: -100, rotate: -360 }) )
]); 

function slideTo(direction) { 
    const optional = { optional: true }; 
    return [ 
        query(':enter, :leave', [ 
            style({ position: 'absolute', top: 0, [direction]: 0, width: '100%' }) ], optional), 
            query(':enter', [ 
                style({ [direction]: '-100%'}) ]), 
                group([ 
                    query(':leave', [ 
                        animate('600ms ease', 
                        style({ [direction]: '100%'})) ], optional),
                         query(':enter', [ 
                             animate('600ms ease', 
                             style({ [direction]: '0%'})) 
                            ]) 
                        ]), 
// Normalize the page style... Might not be necessary 
// Required only if you have child animations on the page 
// query(':leave', animateChild()), 
// query(':enter', animateChild()), 
];
} 

function translateTo({x = 100, y = 0, rotate = 0}) { 
    const optional = { optional: true }; 
    return [ 
        query(':enter, :leave', [ 
            style({ position: 'absolute', top: 0, left: 0, width: '100%' }) ], optional), 
            query(':enter', [ 
                style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`}) ]), 
            group([ 
                query(':leave', [ 
                    animate('600ms ease-out', 
                    style({ transform: `translate(${x}%, ${y}%) rotate(${rotate}deg)`})) ], optional), 
                    query(':enter', [ 
                        animate('600ms ease-out', 
                        style({ transform: `translate(0, 0) rotate(0)`})) 
                    ]) 
                ]), 
            ];
        } 
        
// Keyframes 
export const stepper = 
trigger('routeAnimations', [ 
    transition('isRight <=> isLeft', [ 
        query(':enter, :leave', [ 
            style({ 
                position: 'absolute', 
                left: 0, 
                width: '100%', 
            }), ],{optional:true}), 
            group([ 
                query(':enter', [ 
                    animate('2000ms ease', keyframes([ 
                        style({ transform: 'scale(0) translateX(100%)', offset: 0 }), 
                        style({ transform: 'scale(0.5) translateX(25%)', offset: 0.3 }), 
                        style({ transform: 'scale(1) translateX(0%)', offset: 1 }), ])), ],{optional:true}), 
                query(':leave', [ 
                    animate('2000ms ease', keyframes([ 
                        style({ transform: 'scale(1)', offset: 0 }), 
                        style({ transform: 'scale(0.5) translateX(-25%) rotate(0)', offset: 0.35 }), 
                        style({ opacity: 0, transform: 'translateX(-50%) rotate(-180deg) scale(6)', offset: 1 }), 
                    ])), 
                ],{optional:true}) 
                    ]), 
                ]) 
            ]);
