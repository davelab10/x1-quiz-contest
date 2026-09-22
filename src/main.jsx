import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
const heroVideo = '/videos/web/hero.mp4'
const countdownVideo = '/videos/web/countdown.mp4'
const presenterVideo = '/videos/web/presenter.mp4'
const leaderboardVideo = '/videos/web/leaderboard.mp4'
const questionVideo = '/videos/web/question.mp4'
const wordVideo = '/videos/web/answer.mp4'
const controllerVideo = '/videos/web/controller.mp4'
import landingBackground from '../assets/Landingpage Background.png'
import logo from '../assets/X1 Logo Weiss Transparent.png'
import './styles.css'

const rounds = [
  {
    id: 'question',
    index: '01',
    label: 'The question',
    cue: 'A question lands in every seat.',
    detail: 'The whole cinema sees the same prompt.',
    video: questionVideo,
  },
  {
    id: 'presenter',
    index: '02',
    label: 'The presenter',
    cue: 'A voice turns silence into suspense.',
    detail: 'The next answer becomes a shared moment.',
    video: presenterVideo,
  },
  {
    id: 'word',
    index: '03',
    label: 'The answer',
    cue: 'The room starts to solve together.',
    detail: 'Every round changes the screen and the energy.',
    video: wordVideo,
  },
]

function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

function usePageMotion() {
  useEffect(() => {
    const parallaxNodes = [...document.querySelectorAll('[data-parallax]')]
    let frame = 0

    const update = () => {
      frame = 0
      parallaxNodes.forEach((node) => {
        const bounds = node.getBoundingClientRect()
        const offset = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) * -0.1
        node.style.setProperty('--depth-offset', offset.toFixed(2) + 'px')
      })
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

function Video({ src, className = '', priority = false }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.defaultMuted = true
    video.muted = true
    const playback = video.play()

    playback?.catch(() => {})

    return () => video.pause()
  }, [src])

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      autoPlay
      muted
      defaultMuted
      loop
      playsInline
      preload={priority ? 'auto' : 'metadata'}
      aria-hidden="true"
    />
  )
}

function ArrowMark() {
  return <span className="arrow-mark" aria-hidden="true">↘</span>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeRound, setActiveRound] = useState(rounds[0])
  const [experienceRef, experienceVisible] = useReveal()
  const [roundsRef, roundsVisible] = useReveal()
  const [controllerRef, controllerVisible] = useReveal()
  const [competitionRef, competitionVisible] = useReveal()
  const [finalRef, finalVisible] = useReveal()

  usePageMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 34)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const navClass = 'site-nav' + (scrolled ? ' site-nav--scrolled' : '')
  const experienceClass = 'threshold' + (experienceVisible ? ' is-visible' : '')
  const roundsClass = 'rounds-show' + (roundsVisible ? ' is-visible' : '')
  const controllerClass = 'transmission' + (controllerVisible ? ' is-visible' : '')
  const competitionClass = 'competition-burst' + (competitionVisible ? ' is-visible' : '')
  const finalClass = 'final-cta' + (finalVisible ? ' is-visible' : '')

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className={navClass}>
        <a className="brand-mark" href="#top" aria-label="X1 Quiz Show home" onClick={closeMenu}>
          <img src={logo} alt="X1 Quiz Show" />
        </a>

        <nav id="main-navigation" className={'nav-links' + (menuOpen ? ' nav-links--open' : '')} aria-label="Main navigation">
          <a href="#experience" onClick={closeMenu}>The shift</a>
          <a href="#rounds" onClick={closeMenu}>The rounds</a>
          <a href="#controller" onClick={closeMenu}>Phone to screen</a>
          <a href="#competition" onClick={closeMenu}>The room</a>
        </nav>

        <a className="nav-cta" href="#rounds" onClick={closeMenu}>Enter the show</a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          <i aria-hidden="true" />
        </button>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-environment" aria-hidden="true">
            <Video src={heroVideo} className="hero-video" priority />
          </div>
          <div className="hero-vignette" aria-hidden="true" />
          <div className="hero-frame-line hero-frame-line--top" aria-hidden="true" />
          <div className="hero-frame-line hero-frame-line--bottom" aria-hidden="true" />

          <div className="page-width hero-content">
            <div className="hero-brand-lockup">
              <img src={logo} alt="" />
              <span>X1 / Live cinema quiz show</span>
            </div>

            <div className="hero-title-lockup">
              <p className="hero-kicker">The audience enters the screen</p>
              <h1 id="hero-title">The cinema<br /><span>becomes the</span><em>game.</em></h1>
            </div>

            <div className="hero-footer">
              <p>Watch, then choose.</p>
              <a className="text-link text-link--light" href="#experience">
                Make the shift <ArrowMark />
              </a>
            </div>
          </div>

          <div className="hero-side-note" aria-hidden="true">
            <span>01</span>
            <span>SCREEN / ROOM / PLAYER</span>
          </div>
        </section>

        <section
          className={experienceClass}
          id="experience"
          ref={experienceRef}
          aria-labelledby="experience-title"
        >
          <div className="threshold-environment" data-parallax aria-hidden="true">
            <Video src={countdownVideo} className="threshold-cinema" />
          </div>
          <div className="threshold-blackout" aria-hidden="true" />

          <div className="page-width threshold-stage">
            <div className="threshold-copy reveal reveal--clip">
              <p className="chapter-label">01 / From watching to playing</p>
              <div className="threshold-wordmark" aria-label="Watching becomes playing">
                <span>Watching</span>
                <b>→</b>
                <em>Playing</em>
              </div>
              <h2 id="experience-title">The screen asks.<br /><em>The room answers.</em></h2>
              <p className="threshold-description">X1 turns a cinema audience into part of the show.</p>
            </div>

            <div className="threshold-phone media-frame reveal reveal--phone" data-parallax aria-hidden="true">
              <Video src={controllerVideo} className="cover-video" />
              <span className="media-corner media-corner--top">PERSONAL INPUT</span>
              <span className="media-corner media-corner--bottom">YOUR PHONE / LIVE</span>
            </div>

            <div className="threshold-signal" aria-hidden="true">
              <span />
              <i>the room is about to play</i>
            </div>
          </div>
        </section>

        <section
          className={roundsClass}
          id="rounds"
          ref={roundsRef}
          aria-labelledby="rounds-title"
        >
          <div className="page-width rounds-intro reveal reveal--clip">
            <div className="rounds-heading">
              <p className="chapter-label">02 / The show is changing</p>
              <h2 id="rounds-title">Every round<br /><em>reframes the room.</em></h2>
            </div>
            <p>Question. Presenter. Answer. The screen shifts state, and the room follows.</p>
          </div>

          <div className="page-width show-floor">
            <div className="show-backdrop" data-parallax aria-hidden="true">
              <Video src={presenterVideo} className="cover-video" />
            </div>

            <div className="show-stage">
              <div className="stage-topline">
                <span>X1 / LIVE ROUND</span>
                <span>THE CINEMA IS PLAYING</span>
              </div>
              <div className="round-screen" id="round-preview">
                <div className="round-screen-depth" aria-hidden="true">
                  <Video src={questionVideo} className="cover-video" />
                </div>
                <div className="round-screen-media" key={activeRound.id}>
                  <Video src={activeRound.video} className="cover-video" />
                </div>
                <div className="round-screen-mask" aria-hidden="true" />
                <div className="round-screen-cue" aria-live="polite">
                  <span className="round-screen-index">{activeRound.index}</span>
                  <div>
                    <strong>{activeRound.cue}</strong>
                    <p>{activeRound.detail}</p>
                  </div>
                </div>
              </div>
              <div className="stage-baseline" aria-hidden="true">
                <span>THE ROOM</span>
                <span>THE SCREEN</span>
                <span>THE NEXT ANSWER</span>
              </div>
            </div>

            <div className="rounds-console">
              <div className="console-heading">
                <span>Round selector</span>
                <b>01 / 03</b>
              </div>
              <div className="round-selector" role="tablist" aria-label="Choose a live quiz round">
                {rounds.map((round) => (
                  <button
                    className={'round-tab' + (activeRound.id === round.id ? ' round-tab--active' : '')}
                    key={round.id}
                    type="button"
                    role="tab"
                    aria-selected={activeRound.id === round.id}
                    aria-controls="round-preview"
                    onClick={() => setActiveRound(round)}
                  >
                    <span>{round.index}</span>
                    <strong>{round.label}</strong>
                    <i aria-hidden="true">↘</i>
                  </button>
                ))}
              </div>
              <p className="console-note">Choose a state. Watch the show change.</p>
            </div>
          </div>
        </section>

        <section
          className={controllerClass}
          id="controller"
          ref={controllerRef}
          aria-labelledby="controller-title"
        >
          <div className="transmission-depth" data-parallax aria-hidden="true">
            <Video src={leaderboardVideo} className="cover-video" />
          </div>
          <div className="transmission-veil" aria-hidden="true" />

          <div className="page-width transmission-stage">
            <div className="transmission-screen media-frame reveal reveal--screen" data-parallax aria-hidden="true">
              <Video src={questionVideo} className="cover-video" />
              <div className="screen-interface">
                <span>SHARED RESULT</span>
                <strong>THE ROOM SEES IT</strong>
              </div>
            </div>

            <div className="transmission-phone media-frame reveal reveal--phone-large" data-parallax aria-hidden="true">
              <Video src={controllerVideo} className="cover-video" />
              <div className="phone-glass-label">
                <span>PERSONAL INPUT</span>
                <strong>YOUR CHOICE</strong>
              </div>
            </div>

            <div className="transmission-copy reveal reveal--clip">
              <p className="chapter-label">03 / Phone to screen</p>
              <h2 id="controller-title">Your answer<br /><em>hits the screen.</em></h2>
              <p>One person chooses. The whole cinema sees the result.</p>
            </div>

            <div className="transmission-bridge" aria-hidden="true">
              <span />
              <b>→</b>
              <i />
            </div>
          </div>
        </section>

        <section
          className={competitionClass}
          id="competition"
          ref={competitionRef}
          aria-labelledby="competition-title"
        >
          <div className="competition-atmosphere" data-parallax aria-hidden="true">
            <Video src={presenterVideo} className="cover-video" />
          </div>
          <div className="competition-veil" aria-hidden="true" />

          <div className="page-width competition-stage">
            <div className="competition-cue reveal reveal--clip">
              <span>04 / The room</span>
              <strong>Now everyone<br /><em>keeps score.</em></strong>
            </div>

            <div className="leaderboard-plane media-frame reveal reveal--plane" data-parallax aria-hidden="true">
              <Video src={leaderboardVideo} className="cover-video" />
              <span className="plane-label">THE LEADERBOARD / LIVE</span>
            </div>

            <div className="question-plane media-frame reveal reveal--question" aria-hidden="true">
              <Video src={questionVideo} className="cover-video" />
              <span className="plane-label">THE NEXT QUESTION</span>
            </div>

            <div className="competition-copy reveal reveal--clip">
              <h2 id="competition-title">A cinema<br /><em>with a pulse.</em></h2>
              <p>Every choice becomes visible. Every seat has a reason to stay in the game.</p>
            </div>
          </div>
        </section>

        <section
          className={finalClass}
          id="final-cta"
          ref={finalRef}
          style={{ '--cta-image': 'url("' + landingBackground + '")' }}
          aria-labelledby="final-title"
        >
          <div className="final-cta-scrim" aria-hidden="true" />
          <div className="page-width final-cta-content reveal reveal--clip">
            <img className="final-logo" src={logo} alt="X1 Quiz Show" />
            <p className="chapter-label">05 / The invitation</p>
            <h2 id="final-title">Make the screen<br /><em>the place to be.</em></h2>
            <a className="cta-button" href="#rounds">Watch the show <ArrowMark /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <a className="footer-brand" href="#top" aria-label="Back to X1 Quiz Show home">
            <img src={logo} alt="X1 Quiz Show" />
          </a>
          <p>Interactive cinema for a room full of players.</p>
          <nav aria-label="Footer navigation">
            <a href="#experience">The shift</a>
            <a href="#rounds">The rounds</a>
            <a href="#controller">Phone to screen</a>
          </nav>
          <span className="footer-mark">X1 / Quiz Show</span>
        </div>
        <nav className="page-width footer-legal" aria-label="Rechtliche Navigation">
          <span>Impressum</span>
          <span>AGB</span>
          <span>Widerrufsrecht</span>
          <span>Über Uns</span>
          <span>Datenschutz</span>
        </nav>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
