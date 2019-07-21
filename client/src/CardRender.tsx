import React from 'react'
import { Card, prettifyCard } from './cards'

export const CardRender = ({ card }: { card: Card }) => {
  const { rank, suit, color } = prettifyCard(card)
  return (
    <div
      style={{
        fontSize: 14,
        width: 40,
        height: 60,
        border: `2px solid ${color}`,
        borderRadius: 10,
        color,
        padding: 10,
      }}
    >
      {rank}
      {suit}
    </div>
  )
}
