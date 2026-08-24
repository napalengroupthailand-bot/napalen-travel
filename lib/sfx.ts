/** เสียงคลิกเบา ๆ ด้วย Web Audio API */
let ctx: AudioContext | null = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
  }
  return ctx
}

export function playClick() {
  try {
    const c = getCtx()
    if (!c) return
    if (c.state === 'suspended') void c.resume()
    const t0 = c.currentTime
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(920, t0)
    o.frequency.exponentialRampToValueAtTime(480, t0 + 0.07)
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.1, t0 + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1)
    o.connect(g)
    g.connect(c.destination)
    o.start(t0)
    o.stop(t0 + 0.12)
  } catch {
    /* ignore */
  }
}

export function playSuccess() {
  try {
    const c = getCtx()
    if (!c) return
    if (c.state === 'suspended') void c.resume()
    const t0 = c.currentTime
    ;[523, 659, 784].forEach((f, i) => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.type = 'sine'
      o.frequency.value = f
      const start = t0 + i * 0.06
      g.gain.setValueAtTime(0.0001, start)
      g.gain.exponentialRampToValueAtTime(0.09, start + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.14)
      o.connect(g)
      g.connect(c.destination)
      o.start(start)
      o.stop(start + 0.15)
    })
  } catch {
    /* ignore */
  }
}

export function spawnRipple(
  target: HTMLElement,
  clientX: number,
  clientY: number,
) {
  const rect = target.getBoundingClientRect()
  const x = clientX - rect.left
  const y = clientY - rect.top
  const ripple = document.createElement('span')
  ripple.className = 'ripple-ink'
  const size = Math.max(rect.width, rect.height) * 2.2
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${x - size / 2}px`
  ripple.style.top = `${y - size / 2}px`
  if (getComputedStyle(target).position === 'static') {
    target.style.position = 'relative'
  }
  target.style.overflow = 'hidden'
  target.appendChild(ripple)
  window.setTimeout(() => ripple.remove(), 650)
}

export function tapFeedback(e: { currentTarget: EventTarget; clientX?: number; clientY?: number; touches?: TouchList }) {
  playClick()
  const el = e.currentTarget as HTMLElement
  let x = e.clientX ?? 0
  let y = e.clientY ?? 0
  if (e.touches && e.touches[0]) {
    x = e.touches[0].clientX
    y = e.touches[0].clientY
  }
  if (!x && !y) {
    const r = el.getBoundingClientRect()
    x = r.left + r.width / 2
    y = r.top + r.height / 2
  }
  spawnRipple(el, x, y)
}
