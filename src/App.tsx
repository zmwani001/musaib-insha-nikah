import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowDown, ArrowUpRight, CalendarDays, Clock3, Compass, Heart,
  MapPin, Moon, Sparkles, Star,
} from 'lucide-react'

const event = {
  groom: 'Musaib Sayyed',
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
      <section className="hero" id="home">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-wash" aria-hidden="true" />
        <div className="hero-frame" aria-hidden="true" />
        <div className="hero-content">
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
        <div className="section-ornament top-ornament" aria-hidden="true">✳</div>
        <div className="content-narrow reveal">
          <SectionEyebrow>A day of faith, love & family</SectionEyebrow>
          <h2 className="section-title">A Blessed <em>Beginning</em></h2>
          <Ornament />
          <p className="blessing-copy">Two souls, one beautiful promise, and a new journey beginning with the blessings of Allah.</p>
          <p className="body-copy">With the duas and blessings of our families, we invite you to join us as we celebrate the sacred bond of Nikah between Musaib and Insha.</p>
          <p className="body-copy">Your presence and prayers will make this occasion even more special.</p>
          <div className="verse">
            <span className="verse-mark">“</span>
            <p>And We created you in pairs.</p>
            <span className="verse-source">— SURAH AN-NABA (78:8)</span>
          </div>
        </div>
        <div className="section-ornament bottom-ornament" aria-hidden="true">✳</div>
      </section>

      <section className="details-section section-pad" id="details">
        <div className="content-wide">
          <div className="section-heading reveal">
            <SectionEyebrow>With joy in our hearts</SectionEyebrow>
            <h2 className="section-title">The Wedding <em>Details</em></h2>
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

      <section className="countdown-section section-pad">
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
          <p className="closing-copy">We look forward to sharing this blessed moment with you. Please remember Musaib and Insha in your prayers as they begin this new chapter of their lives.</p>
          <p className="closing-signoff">With love, duas, and gratitude</p>
          <p className="closing-names">Musaib <span>&amp;</span> Insha</p>
          <Ornament small />
        </div>
        <footer className="footer"><span>MADE WITH DUAS</span><span>31 · 10 · 2026</span><span>SRINAGAR, KASHMIR</span></footer>
      </section>
    </main>
  )
}

export default App
