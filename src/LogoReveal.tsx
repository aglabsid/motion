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

const { fontFamily } = loadFont('normal', { weights: ['700'] })

const BACKGROUND = '#F8FAFC'
const BRAND_BLUE = '#135AA6'

// Timing (60fps)
const DRAW_STAGGER = 8 // frames between each path starting
const DRAW_DURATION = 110 // frames each path takes to draw
const FILL_START = 136 // stroke -> fill cross-fade
const FILL_DURATION = 44
const TEXT_START = 176 // brand name enters as logo settles
const TEXT_DURATION = 40

type LogoPath = {
  d: string
  fill: string
  stroke: string
  fillRule?: 'evenodd'
}

// Paths from assets/logo.svg (1024x1024 viewBox), in draw order:
// main swoosh -> inner arc -> detail strokes -> dot
const LOGO_PATHS: LogoPath[] = [
  {
    d: 'M723.442 128C749.304 220.58 781.689 434.75 704.326 550.794C677.339 596.896 588.508 693.599 449.076 711.59V654.243C595.255 630.63 693.082 509.189 699.828 394.495C705.226 302.74 689.334 229.575 680.713 204.463C635.36 209.71 524.414 235.947 443.454 298.917C342.253 377.628 328.76 457.464 327.635 541.798C326.511 626.132 416.467 711.59 400.724 727.332C384.982 743.075 251.172 682.354 274.786 483.326C298.399 284.299 463.694 224.703 533.41 192.094C589.182 166.006 683.337 138.495 723.442 128Z',
    fill: BRAND_BLUE,
    stroke: BRAND_BLUE,
  },
  {
    d: 'M482.81 872.387C469.691 878.759 434.458 884.98 398.476 858.893C353.498 826.284 346.751 753.195 351.249 691.35C355.747 629.505 432.209 433.851 523.29 406.864C614.37 379.877 479.436 409.113 415.343 653.119C382.059 798.848 433.709 827.783 463.694 824.035L482.81 872.387Z',
    fill: BRAND_BLUE,
    stroke: BRAND_BLUE,
  },
  {
    d: 'M482.81 872.387C469.691 878.759 434.458 884.981 398.476 858.893C353.498 826.284 346.751 753.195 351.249 691.35C355.747 629.505 432.209 433.851 523.29 406.864C614.37 379.877 479.436 409.113 415.343 653.119M482.81 872.387C438.956 880.633 364.068 848.323 415.343 653.119M482.81 872.387L463.694 824.035C433.709 827.783 382.059 798.848 415.343 653.119',
    fill: 'none',
    stroke: BRAND_BLUE,
  },
  {
    d: 'M527.787 761.066C565.048 761.066 595.254 791.272 595.254 828.533C595.254 865.794 565.048 896 527.787 896C490.526 896 460.32 865.794 460.32 828.533C460.32 791.272 490.526 761.066 527.787 761.066ZM527.787 806.044C515.367 806.044 505.298 816.113 505.298 828.533C505.298 840.953 515.367 851.022 527.787 851.022C540.208 851.022 550.276 840.953 550.276 828.533C550.276 816.113 540.208 806.044 527.787 806.044Z',
    fill: BRAND_BLUE,
    stroke: BRAND_BLUE,
    fillRule: 'evenodd',
  },
]

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
