import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import aayatAudio from '../assets/aayat.mp3'
import {
  ArrowDown, ArrowUpRight, CalendarDays, Clock3, Compass, Heart,
  MapPin, Menu, Moon, Pause, Play, Sparkles, Star, X,
} from 'lucide-react'

const event = {
  groom: 'Musaib Sayed',
  bride: 'Insha Bint Mushtaq',
  dateLabel: 'Saturday, 31 October 2026',
  islamicDate: '19 Jumada al-Awwal 1448 AH',
  timeLabel: '4:00 PM onwards, after Asr Prayer',
  venue: 'Darsgahi Gousia',
  address: 'Brein, Srinagar, Jammu & Kashmir, India',
  // 31 October 2026, 4:00 PM in Asia/Kolkata = 10:30 UTC.
  targetUtc: Date.UTC(2026, 9, 31, 10, 30, 0),
}

const venueQuery = encodeURIComponent(`${event.venue}, ${event.address}`)
const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venueQuery}`
const mapsEmbedUrl = `https://maps.google.com/maps?q=${venueQuery}&output=embed`

function useCountdown(targetUtc: number) {
  const getRemaining = () => Math.max(0, targetUtc - Date.now())
  const [remaining, setRemaining] = useState(getRemaining)

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000)
    return () => window.clearInterval(timer)
  }, [targetUtc])

  return useMemo(() => {
    const totalSeconds = Math.floor(remaining / 1000)
    return {
      started: remaining <= 0,
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    }
  }, [remaining])
}

function Ornament({ small = false }: { small?: boolean }) {
  return (
    <div className={`ornament ${small ? 'ornament-small' : ''}`} aria-hidden="true">
      <span />
      <span className="ornament-diamond">✧</span>
      <span />
    </div>
  )
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

function App() {
  const countdown = useCountdown(event.targetUtc)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [audioTime, setAudioTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioError, setAudioError] = useState('')
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navItems = [
    { label: 'Invitation', href: '#home', section: 'home' },
    { label: 'The Occasion', href: '#blessing', section: 'blessing' },
    { label: 'Details', href: '#details', section: 'details' },
    { label: 'Venue', href: '#venue', section: 'venue' },
    { label: 'Countdown', href: '#countdown', section: 'countdown' },
  ]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => setIsAudioPlaying(false)
    const handlePause = () => setIsAudioPlaying(false)
    const handlePlay = () => setIsAudioPlaying(true)
    const handleTimeUpdate = () => setAudioTime(audio.currentTime)
    const handleDurationChange = () => setAudioDuration(audio.duration)

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleDurationChange)
    audio.addEventListener('durationchange', handleDurationChange)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleDurationChange)
      audio.removeEventListener('durationchange', handleDurationChange)
    }
  }, [])

  const toggleAudio = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        setAudioError('')
        await audio.play()
      } catch (error) {
        console.error('Unable to play the invitation audio.', error)
        setAudioError('Audio could not be played. Please try again.')
      }
    } else {
      audio.pause()
    }
  }
  const audioClock = `${Math.floor(audioTime / 60)}:${String(Math.floor(audioTime % 60)).padStart(2, '0')}`
  const audioProgress = audioDuration > 0 ? audioTime / audioDuration : 0

  useEffect(() => {
    const sections = navItems
      .map(({ section }) => document.getElementById(section))
      .filter((section): section is HTMLElement => section !== null)
    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.35] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }),
      { threshold: 0.12 },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const details = [
    { icon: Heart, label: 'The occasion', value: 'Nikah Ceremony' },
    { icon: Star, label: 'The groom', value: event.groom },
    { icon: Heart, label: 'The bride', value: event.bride },
    { icon: CalendarDays, label: 'Date', value: event.dateLabel },
    { icon: Moon, label: 'Islamic date', value: event.islamicDate },
    { icon: Clock3, label: 'Time', value: event.timeLabel },
    { icon: MapPin, label: 'Venue', value: `${event.venue}\n${event.address}` },
  ]

  return (
    <main>
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand-block" href="#home" aria-label="Musaib and Insha, home">
            <div className="brand-mark" aria-hidden="true">
              <span className="brand-m">M</span>
              <span className="brand-amp">&amp;</span>
              <span className="brand-i">I</span>
            </div>
          </a>

          <nav className={`top-nav${isMenuOpen ? ' is-open' : ''}`} id="main-navigation" aria-label="Main navigation">
            {navItems.map(({ label, href, section }) => (
              <a
                key={label}
                className={`nav-link${activeSection === section ? ' active' : ''}`}
                href={href}
                aria-current={activeSection === section ? 'location' : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="topbar-actions">
            <button
              type="button"
              className="menu-toggle"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="main-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            <button
              type="button"
              className={`audio-island${isAudioPlaying ? ' is-playing' : ''}`}
              aria-label={isAudioPlaying ? 'Pause Quran recitation' : 'Play Quran recitation'}
              aria-pressed={isAudioPlaying}
              onClick={toggleAudio}
              title={audioError || undefined}
            >
              <span className="island-control" aria-hidden="true">
                {isAudioPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              </span>
              <span className="island-time">{audioClock}</span>
              <span className="island-wave" aria-hidden="true">
                {Array.from({ length: 16 }, (_, index) => (
                  <i className={index / 16 < audioProgress ? 'heard' : ''} key={index} />
                ))}
              </span>
            </button>
            {audioError && <span className="sr-only" role="status">{audioError}</span>}
          </div>
        </div>
      </header>

      <audio ref={audioRef} src={aayatAudio} preload="auto" />

      <section className="hero" id="home">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-wash" aria-hidden="true" />
        <div className="hero-frame" aria-hidden="true" />
        <div className="hero-content">
          <Ornament small />
          <div className="bismillah" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <p className="translation">In the name of Allah, the Most Gracious, the Most Merciful</p>
          <Ornament />
          <p className="intro-line">Together with their families</p>
          <h1 className="couple-name">{event.groom}</h1>
          <div className="ampersand">&amp;</div>
          <h1 className="couple-name bride-name">{event.bride}</h1>
          <p className="invitation-copy">Request the honour of your presence<br className="desktop-break" /> at their Nikah ceremony</p>
          <div className="hero-meta">
            <span>{event.dateLabel}</span>
            <i />
            <span>{event.timeLabel}</span>
          </div>
          <p className="hero-location"><MapPin size={14} strokeWidth={1.5} /> {event.venue}, Brein, Srinagar</p>
          <a className="text-link hero-link" href="#details">Explore the invitation <ArrowDown size={14} /></a>
        </div>
        <div className="hero-side-note">A BLESSED BEGINNING · SRINAGAR, KASHMIR</div>
        <a className="scroll-cue" href="#blessing" aria-label="Scroll to the invitation"><span /></a>
      </section>

      <section className="blessing section-pad" id="blessing">
        <div className="section-ornament top-ornament" aria-hidden="true">✳︎</div>
        <div className="content-narrow reveal">
          <SectionEyebrow>A day of faith, love & family</SectionEyebrow>
          <h2 className="section-title">A Blessed <em>Beginning</em></h2>
          <Ornament />
          <div className="blessing-copy">
            <p>With gratitude to Allah and the duas of our families, we invite you to celebrate the Nikah of Musaib and Insha.</p>
            <p>Your presence and prayers would mean the world to us.</p>
          </div>
          <div className="verse">
            <p className="verse-arabic" lang="ar" dir="rtl">وَخَلَقْنَاكُمْ أَزْوَاجًا</p>
            <p className="verse-translation">And We created you in pairs.</p>
            <span className="verse-source">— SURAH AN-NABA (78:8)</span>
          </div>
        </div>
        <div className="section-ornament bottom-ornament" aria-hidden="true">✳︎</div>
      </section>

      <section className="details-section section-pad" id="details">
        <div className="content-wide">
          <div className="section-heading reveal">
            <h2 className="section-title">Nikah <em>Details</em></h2>
            <Ornament />
            <p className="body-copy">Every detail, shared with love. We would be honoured to have you with us.</p>
          </div>
          <div className="details-grid">
            {details.map(({ icon: Icon, label, value }, index) => (
              <article className={`detail-card reveal detail-${index}`} key={label}>
                <span className="detail-icon"><Icon size={19} strokeWidth={1.35} /></span>
                <p className="detail-label">{label}</p>
                <p className="detail-value">{value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="venue-section section-pad" id="venue">
        <div className="venue-layout content-wide">
          <div className="venue-copy reveal">
            <SectionEyebrow>A place to gather</SectionEyebrow>
            <h2 className="section-title">Join Us in <em>Srinagar</em></h2>
            <Ornament />
            <div className="venue-pin"><MapPin size={19} strokeWidth={1.4} /></div>
            <h3 className="venue-name">{event.venue}</h3>
            <p className="venue-address">{event.address}</p>
            <p className="body-copy venue-note">We look forward to welcoming you for this blessed occasion in the heart of beautiful Kashmir.</p>
            <div className="venue-actions">
              <a className="button button-primary" href={mapsUrl} target="_blank" rel="noreferrer">
                <Compass size={16} /> Get Directions <ArrowUpRight size={15} />
              </a>
              <a className="button button-outline" href="https://darsgahigousia.com/" target="_blank" rel="noreferrer">
                View Venue Website <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="map-wrap reveal">
            <div className="map-caption"><span>THE DESTINATION</span><span>BREIN · SRINAGAR</span></div>
            <iframe
              title="Map showing Darsgahi Gousia, Brein, Srinagar"
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="map-footer"><MapPin size={14} /> {event.venue}, Brein, Srinagar</div>
          </div>
        </div>
      </section>

      <section className="countdown-section section-pad" id="countdown">
        <div className="countdown-pattern" aria-hidden="true" />
        <div className="content-narrow reveal">
          <SectionEyebrow>Until we gather, Insha’Allah</SectionEyebrow>
          <h2 className="section-title">Counting the <em>Moments</em></h2>
          <Ornament />
          {countdown.started ? (
            <p className="event-started"><Sparkles size={19} /> The blessed day is here.</p>
          ) : (
            <div className="countdown" aria-label="Countdown to the Nikah ceremony">
              {[
                ['Days', countdown.days],
                ['Hours', countdown.hours],
                ['Minutes', countdown.minutes],
                ['Seconds', countdown.seconds],
              ].map(([label, value]) => (
                <div className="countdown-unit" key={String(label)}>
                  <span className="countdown-number">{String(value).padStart(2, '0')}</span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
          )}
          <p className="countdown-date">{event.dateLabel} <span>·</span> 4:00 PM IST</p>
        </div>
      </section>

      <section className="closing section-pad">
        <div className="closing-inner reveal">
          <div className="crescent" aria-hidden="true"><Moon size={27} strokeWidth={1} /></div>
          <SectionEyebrow>A little prayer, a lifetime of blessings</SectionEyebrow>
          <h2 className="section-title">Your Duas Are<br />Our Greatest <em>Gift</em></h2>
          <Ornament />
          <p className="closing-copy">Under the blessings of Allah, along the quiet shores of Dal Lake, Srinagar, Kashmir. May this sacred union be enriched with enduring peace, mercy, and grace.</p>
          <figure className="closing-calligraphy">
            <span className="closing-hairline" aria-hidden="true" />
            <p className="closing-arabic" lang="ar" dir="rtl">فِي الدُّنْيَا وَالْآخِرَةِ</p>
            <span className="closing-hairline" aria-hidden="true" />
            <figcaption>Together, in this world and the Hereafter.</figcaption>
          </figure>
          <div className="closing-group-divider">
            <Ornament small />
          </div>
          <div className="closing-dua">
            <p className="closing-dua-arabic" lang="ar" dir="rtl">بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ</p>
            <p className="closing-dua-translation">May Allah bless you both, shower His blessings upon you, and unite you in goodness.</p>
            <p className="closing-dua-source">— SUNAN ABU DAWUD &amp; JAMI' AT-TIRMIDHI</p>
          </div>
          <p className="closing-signoff">With love, duas, and gratitude</p>
          <p className="closing-names">Musaib <span>&amp;</span> Insha</p>
          <Ornament small />
        </div>
        <footer className="footer">© 2026 MUSAIB &amp; INSHA.</footer>
      </section>
    </main>
  )
}

export default App
