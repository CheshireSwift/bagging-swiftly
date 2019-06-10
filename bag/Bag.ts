import * as _ from 'lodash'

type SamplerFunc<T> = (contents: T[]) => T | undefined

type SavedFields = 'contents' | 'removed'
const savedFields: SavedFields[] = ['contents', 'removed']

export type SerializableBag<T> = Pick<Bag<T>, SavedFields>

class Bag<T> {
  contents: T[]
  removed: T[]
  sampler: SamplerFunc<T>

  constructor(
    contents: T[],
    removed: T[] = [],
    sampler: SamplerFunc<T> = Bag._defaultSampler
  ) {
    this.contents = contents
    this.removed = removed
    this.sampler = sampler
  }

  static _defaultSampler = _.sample

  static withContents = <T>(...contents: T[]) => new Bag(contents)

  toJsonable = (): SerializableBag<T> => _.pick(this, savedFields)
  static fromJsonable = <T>(
    jsonable: SerializableBag<T>,
    sampler?: SamplerFunc<T>
  ) => new Bag(jsonable.contents, jsonable.removed, sampler)

  sample = () => this.sampler(this.contents)
  pull = (): [Bag<T>, T | undefined] => {
    const picked = this.sample()
    const newBag = picked
      ? new Bag<T>(
          _.without(this.contents, picked),
          _.concat(this.removed, [picked]),
          this.sampler
        )
      : this
    return [newBag, picked]
  }

  pullAndReplace = this.sample

  add = (newItem: T) =>
    new Bag([...this.contents, newItem], this.removed, this.sampler)
}
export default Bag
