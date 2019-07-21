import * as _ from 'lodash'
import { SerializableBag } from '../../bag/Bag'

const JokerSuit = 99 as 99

const product = <X, Y>(xs: X[], ys: Y[]): Array<[X, Y]> =>
  _.flatMap(xs, (x) => _.map(ys, (y) => [x, y]))

const suits = {
  clubs: 1 as 1,
  diamonds: 2 as 2,
  hearts: 3 as 3,
  spades: 4 as 4,
}

export type Suit = typeof suits[keyof typeof suits] | typeof JokerSuit
type JokerRank = 999 | -999
export type Rank =
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | JokerRank

export type Card = { rank: Rank, suit: Suit }

export const ranks = _.range(2, 15) as Rank[]
export const allCards = _.concat(
  product(ranks, _.values(suits))
    .map(([rank, suit]): Card => ({ rank, suit })),
  [{ rank: 999, suit: JokerSuit }, { rank: -999, suit: JokerSuit }]
)

export const prettySuit = (suit: Suit) => ({
  1: '♣️',
  2: '♦️',
  3: '♥️',
  4: '♠️',
  99: '⚜️',
}[suit])

const faceName: Partial<{ [K in Rank]: string }> = {
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A',
  999: '😈',
  '-999': '👿',
}

export const prettyRank = (rank: Rank): string => faceName[rank] || rank.toString()

export const cardColor = (card: Card) => {
  switch (card.suit) {
    case JokerSuit:
      return 'blue'

    case suits.clubs:
    case suits.spades:
      return 'black'

    case suits.hearts:
    case suits.diamonds:
      return 'maroon'
  }
}

export const prettifyCard = (card: Card): { rank: string, suit: string, color: string } => ({
  suit: prettySuit(card.suit),
  rank: prettyRank(card.rank),
  color: cardColor(card)
})

export type Deck = SerializableBag<Card>
