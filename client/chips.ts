import Bag from "../bag/Bag";
import _ from "lodash";

export type ChipColor = 'white' | 'red' | 'blue' | 'legend'
export type Chip = { color: ChipColor }
export type ChipBag = Bag<Chip>
export const startingChips: Chip[] = [
  ..._.fill(Array(20), { color: 'white' } as Chip),
  ..._.fill(Array(10), { color: 'red' } as Chip),
  ..._.fill(Array(5), { color: 'blue' } as Chip),
]

export const displayColor = (chip: Chip): string => {
  switch (chip.color) {
    case 'legend':
      return 'black'
    case 'blue':
      return 'deepskyblue'
    default:
      return chip.color
  }
}