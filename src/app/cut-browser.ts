// Browser-only effects; Angular owns the markup and project data.
export function initializeCut(root: HTMLElement): () => void {
  const get = <T extends Element>(selector: string) => root.querySelector<T>(selector)!;
  const art = get<HTMLElement>('.art'), cut = get<HTMLElement>('.cut');
  const game = get<HTMLElement>('.game'), frequency = get<HTMLInputElement>('#frequency');
  const status = get<HTMLElement>('#game-status'), audioButton = get<HTMLButtonElement>('#signal-audio');
  const lock = get<HTMLElement>('#lock-fill');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const removers: (() => void)[] = [];
  const listen = (target: EventTarget, event: string, handler: EventListener, options?: AddEventListenerOptions) => {
    target.addEventListener(event, handler, options);
    removers.push(() => target.removeEventListener(event, handler, options));
  };
  let disposed = false, motionFrame = 0, gameFrame = 0, last = 0, clock = 0;
  let position = 0, scrollTarget = 0, range = 1, width = innerWidth;
  let target = 440, locked = false, timer = 0, visible = false, sound = false;
  let context: AudioContext | null = null;
  const voices: { osc: OscillatorNode; gain: GainNode }[] = [];

  function measure() {
    range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    width = innerWidth;
    scrollTarget = Math.max(0, Math.min(1, scrollY / range));
  }
  function paint() {
    const q = reduced.matches ? 0 : position;
    const idle = reduced.matches ? 0 : Math.sin(clock * .42);
    art.style.transform = `translate3d(${Math.sin(q * 7) * 9 + idle * .7}%,${-q * 18 + Math.cos(clock * .31) * (reduced.matches ? 0 : .55)}%,0) rotate(${-7 + q * 28 + idle * .45}deg) scale(${1.13 + Math.sin(q * 6) * .15})`;
    cut.style.transform = `translate3d(${Math.sin(q * 9) * width * .21 + idle * 7}px,0,0) rotate(${17 + q * 30 + idle * .35}deg)`;
  }
  function tick(time: number) {
    if (disposed || reduced.matches || document.hidden) { motionFrame = 0; return; }
    const dt = last ? Math.min((time - last) / 1000, .05) : 1 / 60;
    last = time; clock += dt;
    position += (scrollTarget - position) * (1 - Math.exp(-10 * dt));
    paint(); motionFrame = requestAnimationFrame(tick);
  }
  function startMotion() {
    cancelAnimationFrame(motionFrame); last = 0;
    if (reduced.matches) { position = scrollTarget; paint(); }
    else if (!document.hidden && !disposed) motionFrame = requestAnimationFrame(tick);
  }
  function matched() { return Math.abs(+frequency.value - target) <= 2; }
  function wave(hz: number, time: number) {
    let d = '';
    for (let x = 0; x <= 700; x += 4) d += (x ? 'L' : 'M') + x + ',' + (115 + Math.sin(x / 700 * Math.PI * 2 * (hz / 80) - time) * 65);
    return d;
  }
  function render(time = 0) {
    const phase = reduced.matches ? 0 : time * .0006;
    get<SVGPathElement>('#target-wave').setAttribute('d', wave(target, phase));
    get<SVGPathElement>('#player-wave').setAttribute('d', wave(+frequency.value, phase));
  }
  function animate(time: number) {
    if (disposed || !visible || document.hidden || reduced.matches) { gameFrame = 0; return; }
    render(time); gameFrame = requestAnimationFrame(animate);
  }
  function run() {
    cancelAnimationFrame(gameFrame); render();
    if (visible && !document.hidden && !reduced.matches && !disposed) gameFrame = requestAnimationFrame(animate);
  }
  function soundLevels() {
    if (!context || disposed) return;
    const audible = sound && visible && !document.hidden;
    voices.forEach(v => v.gain.gain.setTargetAtTime(audible ? .025 : 0, context!.currentTime, .04));
    voices[0].osc.frequency.setTargetAtTime(target, context.currentTime, .04);
    voices[1].osc.frequency.setTargetAtTime(+frequency.value, context.currentTime, .04);
  }
  function cancelLock() { clearTimeout(timer); lock.classList.remove('holding'); }
  function newSignal() {
    cancelLock(); locked = false; game.classList.remove('caught');
    const choices: number[] = [];
    for (let hz = 130; hz <= 640; hz += 5) if (Math.abs(hz - target) > 35 && Math.abs(hz - +frequency.value) > 25) choices.push(hz);
    const random = new Uint32Array(1); crypto.getRandomValues(random);
    target = choices[random[0] % choices.length];
    status.textContent = 'New frequency. Match the solid wave to the dashed wave.';
    evaluate(); run();
  }
  function evaluate() {
    get<HTMLOutputElement>('#frequency-value').value = frequency.value + ' Hz';
    render(); soundLevels();
    if (locked) return;
    cancelLock();
    if (matched() && visible && !document.hidden) {
      lock.classList.add('holding');
      timer = window.setTimeout(() => {
        if (disposed || !matched() || !visible || document.hidden) return;
        locked = true; game.classList.add('caught');
        status.textContent = 'Matched. Tuning to another frequency.';
        timer = window.setTimeout(newSignal, 800);
      }, 600);
    }
  }
  async function toggleSound() {
    try {
      if (!context) {
        const Audio = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Audio) throw new Error('Audio unavailable');
        context = new Audio();
        for (let i = 0; i < 2; i++) {
          const osc = context.createOscillator(), gain = context.createGain();
          gain.gain.value = 0; osc.connect(gain).connect(context.destination); osc.start(); voices.push({ osc, gain });
        }
      }
      if (context.state === 'suspended') await context.resume();
      if (disposed) return;
      sound = !sound; audioButton.textContent = sound ? 'SOUND ON' : 'SOUND OFF';
      audioButton.setAttribute('aria-pressed', String(sound)); soundLevels();
    } catch {
      if (disposed) return;
      sound = false; audioButton.textContent = 'SOUND UNAVAILABLE'; audioButton.setAttribute('aria-pressed', 'false'); soundLevels();
    }
  }
  function visibility() {
    if (!visible || document.hidden) { cancelLock(); locked = false; game.classList.remove('caught'); }
    else evaluate();
    soundLevels(); run();
  }
  listen(window, 'scroll', () => { scrollTarget = Math.max(0, Math.min(1, scrollY / range)); }, { passive: true });
  listen(window, 'resize', () => { measure(); if (reduced.matches) paint(); });
  listen(document, 'visibilitychange', () => { startMotion(); visibility(); });
  listen(reduced, 'change', () => { startMotion(); run(); });
  listen(frequency, 'input', evaluate);
  listen(get('#next-signal'), 'click', newSignal);
  listen(audioButton, 'click', () => { void toggleSound(); });
  const resize = new ResizeObserver(measure); resize.observe(get('main'));
  const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; visibility(); }, { threshold: .15 });
  intersection.observe(game);
  measure(); paint(); startMotion(); newSignal();
  return () => {
    disposed = true;
    cancelAnimationFrame(motionFrame); cancelAnimationFrame(gameFrame); cancelLock();
    resize.disconnect(); intersection.disconnect(); removers.forEach(remove => remove());
    voices.forEach(({ osc, gain }) => { osc.stop(); osc.disconnect(); gain.disconnect(); });
    if (context) void context.close().catch(() => undefined);
  };
}
