import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion'
import { Audio } from '@remotion/media'
import { ding, mouseClick, pageTurn, uiSwitch, whoosh } from '@remotion/sfx'
import { loadFont as loadHeading } from '@remotion/google-fonts/Gabarito'
import { loadFont as loadMono } from '@remotion/google-fonts/GoogleSansCode'
import { loadFont as loadEmoji } from '@remotion/google-fonts/NotoColorEmoji'
import { Cursor } from '../Cursor'

const heading = loadHeading('normal', { weights: ['700', '900'] }).fontFamily
const mono = loadMono('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
}).fontFamily
// Pinned so emoji look identical on every machine, not like the host OS set.
const emoji = loadEmoji('normal', { weights: ['400'], subsets: ['emoji'] })
  .fontFamily

// Palette lifted from ctros.aglabs.id's stylesheet + theme-color meta.
const BG = '#0F172A' // oklch(20.84% .0417 266.359)
const SURFACE = '#1E293B' // oklch(27.95% .0368 260.031)
const BORDER = '#334155' // oklch(37.17% .0392 257.287)
const MUTED = '#64748B' // oklch(55.1% .027 264.364)
const TEXT = '#E2E8F0' // oklch(92.88% .0126 255.508)
const ACCENT = '#3B82F6' // oklch(62.3% .214 259.815)

// Scene starts (60fps). Each scene runs until the next one begins.
const HERO = 0 // the site's own hero greeting
const FEATURES = 220 // what the template gives you
const STACK = 560 // what it is built on
const INSTALL = 780 // clone and run
const CTA = 1060 // repo + live demo
export const CTROS_INTRO_DURATION = 1320 // 22s

const HERO_LINE = "Hi, I'm Ctros by Aglabs"
const CHARS_PER_FRAME = 0.16

const FEATURES_LIST = [
  { icon: '⚡', title: 'Fast & Lightweight', body: 'Static site generation' },
  { icon: '🖼️', title: 'Dynamic OG Images', body: 'Auto-generated per page' },
  { icon: '📝', title: 'JSON & MDX Content', body: 'Write posts, not plumbing' },
]

const STACK_LIST = [
  'Astro',
  'React',
  'Tailwind CSS',
  'MDX',
  'Shiki',
  'Giscus',
  'Umami',
]

const INSTALL_LINES = [
  { prompt: '$', text: 'git clone git@github.com:aglabsid/ctros.git' },
  { prompt: '$', text: 'pnpm install' },
  { prompt: '$', text: 'pnpm dev' },
  { prompt: '>', text: 'ready on http://localhost:4321', accent: true },
]

const LINE_STAGGER = 62 // frames between install lines appearing

const fadeUp = (frame: number, from: number, distance = 34) => ({
  opacity: interpolate(frame, [from, from + 30], [0, 1], {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
  }),
  translate: interpolate(
    frame,
    [from, from + 40],
    [`0px ${distance}px`, '0px 0px'],
    {
      extrapolateLeft: 'clamp' as const,
      extrapolateRight: 'clamp' as const,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  ),
})

const Hero: React.FC = () => {
  const frame = useCurrentFrame()
  const typed = HERO_LINE.slice(0, Math.floor(frame * CHARS_PER_FRAME))
  const waving = typed.length === HERO_LINE.length

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 100px',
        gap: 44,
      }}
    >
      <Interactive.Div
        name="Hero greeting"
        style={{
          fontFamily: heading,
          fontWeight: 900,
          fontSize: 104,
          lineHeight: 1.15,
          color: '#FFFFFF',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}
      >
        {typed}
        {waving ? null : <Cursor frame={frame} color={ACCENT} />}
        <span
          style={{
            display: 'inline-block',
            fontFamily: emoji,
            marginLeft: 24,
            opacity: waving ? 1 : 0,
            // Two-beat wave once the line finishes typing.
            rotate: interpolate(
              frame % 72,
              [0, 18, 36, 54, 72],
              ['0deg', '18deg', '0deg', '18deg', '0deg'],
            ),
          }}
        >
          👋
        </span>
      </Interactive.Div>
      <Interactive.Div
        name="Hero subtitle"
        style={{
          fontFamily: mono,
          fontSize: 42,
          color: MUTED,
          textAlign: 'center',
          lineHeight: 1.4,
          ...fadeUp(frame, 156),
        }}
      >
        minimal personal website template
        <br />
        built with <span style={{ color: ACCENT }}>Astro</span>
      </Interactive.Div>
    </AbsoluteFill>
  )
}

const Features: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', padding: '0 110px', gap: 44 }}
    >
      {FEATURES_LIST.map((feature, i) => (
        <Interactive.Div
          key={feature.title}
          name={`Feature: ${feature.title}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            padding: '44px 48px',
            borderRadius: 36,
            backgroundColor: SURFACE,
            border: `2px solid ${BORDER}`,
            ...fadeUp(frame, 16 + i * 62, 46),
          }}
        >
          <span style={{ fontFamily: emoji, fontSize: 76, lineHeight: 1 }}>
            {feature.icon}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span
              style={{
                fontFamily: heading,
                fontWeight: 700,
                fontSize: 54,
                color: '#FFFFFF',
              }}
            >
              {feature.title}
            </span>
            <span style={{ fontFamily: mono, fontSize: 34, color: MUTED }}>
              {feature.body}
            </span>
          </div>
        </Interactive.Div>
      ))}
    </AbsoluteFill>
  )
}

const Stack: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 110px',
        gap: 60,
      }}
    >
      <Interactive.Div
        name="Stack heading"
        style={{
          fontFamily: mono,
          fontSize: 38,
          letterSpacing: '0.24em',
          color: MUTED,
          ...fadeUp(frame, 0, 20),
        }}
      >
        BUILT WITH
      </Interactive.Div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 26,
        }}
      >
        {STACK_LIST.map((name, i) => (
          <Interactive.Div
            key={name}
            name={`Stack chip: ${name}`}
            style={{
              fontFamily: mono,
              fontSize: 44,
              color: TEXT,
              padding: '24px 40px',
              borderRadius: 999,
              backgroundColor: SURFACE,
              border: `2px solid ${BORDER}`,
              ...fadeUp(frame, 34 + i * 18, 28),
            }}
          >
            {name}
          </Interactive.Div>
        ))}
      </div>
    </AbsoluteFill>
  )
}

const Install: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', padding: '0 90px' }}
    >
      <Interactive.Div
        name="Terminal window"
        style={{
          borderRadius: 32,
          backgroundColor: '#0B1220',
          border: `2px solid ${BORDER}`,
          overflow: 'hidden',
          boxShadow: `0 40px 120px ${ACCENT}33`,
          ...fadeUp(frame, 0, 40),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '26px 32px',
            backgroundColor: SURFACE,
          }}
        >
          {['#EF4444', '#F59E0B', '#22C55E'].map((color) => (
            <span
              key={color}
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                backgroundColor: color,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: mono,
              fontSize: 28,
              color: MUTED,
              marginLeft: 16,
            }}
          >
            ctros
          </span>
        </div>
        <div
          style={{
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: 26,
          }}
        >
          {INSTALL_LINES.map((line, i) => (
            <Interactive.Div
              key={line.text}
              name={`Install line: ${line.text}`}
              style={{
                fontFamily: mono,
                fontSize: 28,
                color: line.accent ? '#22C55E' : TEXT,
                whiteSpace: 'nowrap',
                opacity: interpolate(
                  frame,
                  [30 + i * LINE_STAGGER, 52 + i * LINE_STAGGER],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                ),
              }}
            >
              <span style={{ color: line.accent ? '#22C55E' : ACCENT }}>
                {line.prompt}{' '}
              </span>
              {line.text}
            </Interactive.Div>
          ))}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  )
}

const Cta: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', alignItems: 'center', gap: 52 }}
    >
      <Interactive.Div
        name="Logo mark"
        style={{
          width: 220,
          height: 220,
          // The PNG ships its own light square, so just round the corners off.
          borderRadius: 56,
          overflow: 'hidden',
          boxShadow: `0 30px 90px ${ACCENT}44`,
          opacity: interpolate(frame, [0, 24], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(frame, [0, 46], [0.74, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Img
          src={staticFile('ctros-logo.png')}
          style={{ width: 220, height: 220 }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="Wordmark"
        style={{
          fontFamily: heading,
          fontWeight: 900,
          fontSize: 144,
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          opacity: interpolate(frame, [28, 54], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          // Overshoots past 1 then settles.
          scale: interpolate(frame, [28, 58, 76], [0.86, 1.04, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Ctros
      </Interactive.Div>
      <Interactive.Div
        name="Repo"
        style={{
          fontFamily: mono,
          fontSize: 40,
          color: TEXT,
          padding: '30px 56px',
          borderRadius: 999,
          backgroundColor: SURFACE,
          border: `2px solid ${BORDER}`,
          ...fadeUp(frame, 70, 26),
        }}
      >
        github.com/aglabsid/ctros
      </Interactive.Div>
      <Interactive.Div
        name="Live site"
        style={{
          fontFamily: mono,
          fontSize: 44,
          color: ACCENT,
          ...fadeUp(frame, 102, 22),
        }}
      >
        ctros.aglabs.id <Cursor frame={frame} color={ACCENT} />
      </Interactive.Div>
      <Interactive.Div
        name="License"
        style={{
          fontFamily: mono,
          fontSize: 30,
          color: MUTED,
          letterSpacing: '0.16em',
          ...fadeUp(frame, 134, 18),
        }}
      >
        MIT LICENSED
      </Interactive.Div>
    </AbsoluteFill>
  )
}

export const CtrosIntro: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Accent glow drifts with the scene cuts so the background never sits flat. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(62% 40% at 50% ${interpolate(
            frame,
            [HERO, CTA],
            [38, 62],
            { extrapolateRight: 'clamp' },
          )}%, ${ACCENT}26, transparent)`,
        }}
      />

      <Sequence name="Scene: Hero" from={HERO} durationInFrames={FEATURES}>
        <Hero />
      </Sequence>
      <Sequence
        name="Scene: Features"
        from={FEATURES}
        durationInFrames={STACK - FEATURES}
      >
        <Features />
      </Sequence>
      <Sequence
        name="Scene: Stack"
        from={STACK}
        durationInFrames={INSTALL - STACK}
      >
        <Stack />
      </Sequence>
      <Sequence
        name="Scene: Install"
        from={INSTALL}
        durationInFrames={CTA - INSTALL}
      >
        <Install />
      </Sequence>
      <Sequence name="Scene: CTA" from={CTA}>
        <Cta />
      </Sequence>

      <Sequence name="SFX: Hero" from={HERO} layout="none">
        <Audio src={uiSwitch} volume={0.45} />
      </Sequence>
      {FEATURES_LIST.map((feature, i) => (
        <Sequence
          key={feature.title}
          name={`SFX: ${feature.title}`}
          from={FEATURES + 16 + i * 62}
          layout="none"
        >
          <Audio src={ding} volume={0.22} />
        </Sequence>
      ))}
      <Sequence name="SFX: Stack" from={STACK} layout="none">
        <Audio src={whoosh} volume={0.5} />
      </Sequence>
      <Sequence name="SFX: Install" from={INSTALL} layout="none">
        <Audio src={pageTurn} volume={0.4} />
      </Sequence>
      <Sequence name="SFX: CTA" from={CTA} layout="none">
        <Audio src={mouseClick} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  )
}
