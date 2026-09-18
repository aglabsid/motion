import React from 'react'
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion'
import { Audio } from '@remotion/media'
import { ding, whoosh } from '@remotion/sfx'
import { getLength } from '@remotion/paths'
import { loadFont } from '@remotion/google-fonts/Gabarito'
import { BRAND_BLUE, LOGO_PATHS, type LogoPath } from '../logo'

const { fontFamily } = loadFont('normal', { weights: ['700'] })

const BACKGROUND = '#F8FAFC'

// Timing (60fps)
const DRAW_STAGGER = 8 // frames between each path starting
const DRAW_DURATION = 110 // frames each path takes to draw
const FILL_START = 136 // stroke -> fill cross-fade
const FILL_DURATION = 44
const TEXT_START = 176 // brand name enters as logo settles
const TEXT_DURATION = 40

const PATH_LENGTHS = LOGO_PATHS.map((path) => getLength(path.d))

const DrawnPath: React.FC<{ path: LogoPath; index: number; frame: number }> = ({
  path,
  index,
  frame,
}) => {
  const length = PATH_LENGTHS[index]
  const start = index * DRAW_STAGGER
  const drawProgress = interpolate(
    frame,
    [start, start + DRAW_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  )

  const fillOpacity = interpolate(
    frame,
    [FILL_START, FILL_START + FILL_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // Stroke starts bold for visibility while drawing, settles to the
  // original 1px once the fill takes over.
  const strokeWidth = interpolate(
    frame,
    [FILL_START, FILL_START + FILL_DURATION],
    [4, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <path
      d={path.d}
      fill={path.fill}
      fillRule={path.fillRule}
      clipRule={path.fillRule}
      fillOpacity={path.fill === 'none' ? undefined : fillOpacity}
      stroke={path.stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={length}
      strokeDashoffset={length * (1 - drawProgress)}
    />
  )
}

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame()

  const textOpacity = interpolate(
    frame,
    [TEXT_START, TEXT_START + TEXT_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const textY = interpolate(
    frame,
    [TEXT_START, TEXT_START + TEXT_DURATION],
    [20, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 80,
      }}
    >
      <Sequence name="Whoosh (draw-on)" layout="none">
        <Audio src={whoosh} volume={0.8} />
      </Sequence>
      <Sequence name="Ding (text enters)" from={TEXT_START} layout="none">
        <Audio src={ding} volume={0.4} />
      </Sequence>
      <svg width={640} height={640} viewBox="0 0 1024 1024" fill="none">
        {LOGO_PATHS.map((path, i) => (
          <DrawnPath key={i} path={path} index={i} frame={frame} />
        ))}
      </svg>
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 96,
          color: BRAND_BLUE,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          letterSpacing: '0.02em',
        }}
      >
        aglabs.id
      </div>
    </AbsoluteFill>
  )
}
