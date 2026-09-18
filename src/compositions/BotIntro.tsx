import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Interactive,
  Sequence,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion'
import { Audio } from '@remotion/media'
import { ding, mouseClick, uiSwitch, whoosh } from '@remotion/sfx'
import { loadFont as loadHeading } from '@remotion/google-fonts/Gabarito'
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono'
import { BOT_ACCENT, BOT_BG, BOT_SURFACE, BOT_TEXT } from '../logo'
import { Cursor } from '../Cursor'

const heading = loadHeading('normal', { weights: ['700', '900'] }).fontFamily
const mono = loadMono('normal', { weights: ['400', '700'] }).fontFamily

// Scene starts (60fps). Each scene runs until the next one begins.
const BOOT = 0 // terminal types the protocol handle
const BRAND = 200 // logo + product name
const CHAT = 440 // chat mock, what the bot actually is
const CTA = 800 // start chat / telegram handle
export const BOT_INTRO_DURATION = 1080 // 18s

const TYPED = 'aglabs://bot'
const CHARS_PER_FRAME = 0.13

const MESSAGES = [
  { from: 'user' as const, text: 'halo bot', at: 0 },
  { from: 'bot' as const, text: 'hai! ada yang bisa dibantu?', at: 80 },
  { from: 'user' as const, text: 'apa aja yang bisa kamu lakuin?', at: 160 },
  {
    from: 'bot' as const,
    text: 'tanya apa aja, langsung dari Telegram.',
    at: 240,
  },
]

const Boot: React.FC = () => {
  const frame = useCurrentFrame()
  const typed = TYPED.slice(0, Math.floor(frame * CHARS_PER_FRAME))

  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', alignItems: 'center', gap: 48 }}
    >
      <Interactive.Div
        name="Terminal line"
        style={{
          fontFamily: mono,
          fontSize: 64,
          color: BOT_TEXT,
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <span style={{ color: BOT_ACCENT }}>&gt; </span>
        {typed}
        <Cursor frame={frame} color={BOT_ACCENT} />
      </Interactive.Div>
      <Interactive.Div
        name="Online badge"
        style={{
          fontFamily: mono,
          fontSize: 34,
          letterSpacing: '0.18em',
          color: '#4ADE80',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: interpolate(frame, [130, 156], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(frame, [130, 156], [0.9, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            backgroundColor: '#4ADE80',
            opacity: frame % 84 > 58 ? 0.35 : 1,
          }}
        />
        ONLINE
      </Interactive.Div>
    </AbsoluteFill>
  )
}

const Brand: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', alignItems: 'center', gap: 56 }}
    >
      <Interactive.Div
        name="Logo mark"
        style={{
          width: 440,
          height: 440,
          // The PNG is already a circle on transparency, so no card behind it.
          borderRadius: 999,
          boxShadow: `0 40px 120px ${BOT_ACCENT}55`,
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          scale: interpolate(frame, [0, 50], [0.72, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <Img
          src={staticFile('bot-logo.png')}
          style={{ width: 440, height: 440 }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="Product name"
        style={{
          fontFamily: heading,
          fontWeight: 900,
          fontSize: 132,
          color: '#FFFFFF',
          letterSpacing: '-0.01em',
          opacity: interpolate(frame, [40, 72], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          translate: interpolate(frame, [40, 72], ['0px 28px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Aglabs Bot
      </Interactive.Div>
      <Interactive.Div
        name="Tagline"
        style={{
          fontFamily: mono,
          fontSize: 40,
          color: BOT_ACCENT,
          opacity: interpolate(frame, [76, 104], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        a bot by aglabs
      </Interactive.Div>
    </AbsoluteFill>
  )
}

const Bubble: React.FC<{ message: (typeof MESSAGES)[number] }> = ({
  message,
}) => {
  const frame = useCurrentFrame()
  const isBot = message.from === 'bot'

  return (
    <Interactive.Div
      name={`Bubble: ${message.text}`}
      style={{
        alignSelf: isBot ? 'flex-start' : 'flex-end',
        maxWidth: 680,
        padding: '32px 42px',
        borderRadius: 44,
        borderBottomLeftRadius: isBot ? 12 : 44,
        borderBottomRightRadius: isBot ? 44 : 12,
        backgroundColor: isBot ? BOT_SURFACE : BOT_ACCENT,
        color: isBot ? BOT_TEXT : '#FFFFFF',
        fontFamily: mono,
        fontSize: 38,
        lineHeight: 1.35,
        opacity: interpolate(frame, [0, 22], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        translate: interpolate(frame, [0, 32], ['0px 40px', '0px 0px'], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        scale: interpolate(frame, [0, 32], [0.94, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {message.text}
    </Interactive.Div>
  )
}

const Chat: React.FC = () => (
  <AbsoluteFill
    style={{ justifyContent: 'center', padding: '0 120px', gap: 36 }}
  >
    {MESSAGES.map((message) => (
      <Sequence
        key={message.text}
        name={`Message: ${message.text}`}
        from={message.at}
        layout="none"
      >
        <Bubble message={message} />
      </Sequence>
    ))}
  </AbsoluteFill>
)

const Cta: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill
      style={{ justifyContent: 'center', alignItems: 'center', gap: 60 }}
    >
      <Interactive.Div
        name="Start chat button"
        style={{
          fontFamily: mono,
          fontSize: 56,
          color: '#FFFFFF',
          backgroundColor: BOT_ACCENT,
          padding: '40px 80px',
          borderRadius: 28,
          boxShadow: `0 30px 90px ${BOT_ACCENT}55`,
          opacity: interpolate(frame, [0, 26], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          // Overshoots past 1 then settles, so the button reads as pressable.
          scale: interpolate(frame, [0, 32, 48], [0.86, 1.05, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {/* Invisible twin of the cursor keeps the label optically centered. */}
        <span style={{ opacity: 0 }}> ▍</span>start chat{' '}
        <Cursor frame={frame} color={BOT_ACCENT} />
      </Interactive.Div>
      <Interactive.Div
        name="Telegram handle"
        style={{
          fontFamily: mono,
          fontSize: 42,
          color: BOT_TEXT,
          opacity: interpolate(frame, [46, 74], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        t.me/aglabs_bot
      </Interactive.Div>
      <Interactive.Div
        name="Domain"
        style={{
          fontFamily: heading,
          fontWeight: 700,
          fontSize: 52,
          color: BOT_ACCENT,
          letterSpacing: '0.04em',
          opacity: interpolate(frame, [82, 114], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        bot.aglabs.id
      </Interactive.Div>
    </AbsoluteFill>
  )
}

export const BotIntro: React.FC = () => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ backgroundColor: BOT_BG }}>
      {/* Accent glow drifts with the scene cuts so the background never sits flat. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 40% at 50% ${interpolate(
            frame,
            [BOOT, CTA],
            [35, 65],
            { extrapolateRight: 'clamp' },
          )}%, ${BOT_ACCENT}2E, transparent)`,
        }}
      />

      <Sequence name="Scene: Boot" from={BOOT} durationInFrames={BRAND - BOOT}>
        <Boot />
      </Sequence>
      <Sequence name="Scene: Brand" from={BRAND} durationInFrames={CHAT - BRAND}>
        <Brand />
      </Sequence>
      <Sequence name="Scene: Chat" from={CHAT} durationInFrames={CTA - CHAT}>
        <Chat />
      </Sequence>
      <Sequence name="Scene: CTA" from={CTA}>
        <Cta />
      </Sequence>

      <Sequence name="SFX: Boot" from={BOOT + 126} layout="none">
        <Audio src={uiSwitch} volume={0.5} />
      </Sequence>
      <Sequence name="SFX: Brand" from={BRAND} layout="none">
        <Audio src={whoosh} volume={0.6} />
      </Sequence>
      {MESSAGES.map((message) => (
        <Sequence
          key={message.text}
          name={`SFX: ${message.from} message`}
          from={CHAT + message.at}
          layout="none"
        >
          <Audio src={ding} volume={0.25} />
        </Sequence>
      ))}
      <Sequence name="SFX: CTA" from={CTA} layout="none">
        <Audio src={mouseClick} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  )
}
