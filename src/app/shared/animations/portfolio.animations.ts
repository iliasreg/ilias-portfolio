/*
  portfolio.animations.ts
  ───────────────────────────────────────────────────────────────────
  NO @angular/animations — deprecated as of Angular 20.2.

  The new pattern:
    1. Define @keyframes in the component's .scss (or global styles)
    2. Use animate.enter="class-name" / animate.leave="class-name"
       on the element in the template
    3. Angular applies the class on enter, keeps the DOM alive during
       leave so the CSS animation can finish, then removes the element

  This file exports class-name constants so you never hardcode strings
  in templates — typo-safe and easy to refactor.
  ───────────────────────────────────────────────────────────────────
*/

export const Anim = {
  // Single elements — headings, paragraphs
  FADE_UP:    'anim-fade-up',
  FADE_DOWN:  'anim-fade-down',

  // Lists — each child gets the class via *ngFor + stagger delay
  SLIDE_IN:   'anim-slide-in',

  // Scene-level wipe reveal
  CLIP_UP:    'anim-clip-up',

  // Skill bar draw
  DRAW_BAR:   'anim-draw-bar',

  // Project detail expand
  EXPAND:     'anim-expand',

  // Leave animations
  FADE_OUT:   'anim-fade-out',
  CLIP_DOWN:  'anim-clip-down',
} as const;

/*
  USAGE IN A TEMPLATE:
  ─────────────────────────────────────────────
  @if (show) {
    <div [animate.enter]="Anim.FADE_UP" [animate.leave]="Anim.FADE_OUT">
      content
    </div>
  }

  Or with a static string (same thing, less refactor-safe):
    <div animate.enter="anim-fade-up" animate.leave="anim-fade-out">

  STAGGER PATTERN (no special Angular API needed):
  ─────────────────────────────────────────────
  <div *ngFor="let item of items; let i = index"
       animate.enter="anim-slide-in"
       [style.animation-delay]="i * 70 + 'ms'">
    {{ item }}
  </div>

  The CSS keyframes for all these classes live in:
    src/app/shared/animations/_keyframes.scss
  which is imported by styles.scss
*/
