import * as _ from 'lodash'
import { SerializableBag } from '../../bag/Bag'

const JokerRank = 999 as 999
const JokerSuit = 99 as 99

const product = <X, Y>(xs: X[], ys: Y[]): Array<[X, Y]> =>
  _.flatMap(xs, (x) => _.map(ys, (y) => [x, y]))

export type Suit = 1 | 2 | 3 | 4 | typeof JokerSuit
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
  | typeof JokerRank

export type Card = [Rank, Suit]

export const joker: Card = [JokerRank, JokerSuit]

export const ranks = _.range(2, 15) as Rank[]
export const suits = _.range(1, 5) as Suit[]
export const allCards = _.concat(product(ranks, suits), [joker, joker])

export type Deck = SerializableBag<Card>
