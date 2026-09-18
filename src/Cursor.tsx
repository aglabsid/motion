import React from 'react'

// Blinking block cursor, the same ▍ glyph the aglabs sites use.
export const Cursor: React.FC<{ frame: number; color: string }> = ({
  frame,
  color,
}) => <span style={{ color, opacity: frame % 50 < 28 ? 1 : 0 }}>▍</span>
