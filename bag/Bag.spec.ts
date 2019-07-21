import * as _ from 'lodash'

import Bag from './Bag'

describe('a bag', () => {
  const secondItemSampler = (contents: number[]) => contents[1]

  it('can list its contents', () => {
    const contents = [1, 2, 3, 4, 5]
    const bag = Bag.withContents(...contents)
    expect(bag.contents).toEqual(contents)
  })

  it('can be roundtripped through a (JSON-friendly) object', () => {
    const savedBag = new Bag<number | string | boolean>(
      [1, 2, 'a', 'b', true],
      [3, 4, 'x', 'y', false]
    )

    const loadedBag = Bag.fromJsonable(savedBag.toJsonable())

    expect(loadedBag.contents).toEqual(savedBag.contents)
    expect(loadedBag.removed).toEqual(savedBag.removed)
  })

  describe('pulling a random item', () => {
    let fullBag: Bag<number>
    beforeEach(() => {
      fullBag = new Bag([1, 2, 3], [], secondItemSampler)
    })

    it('removes a random item using the sampler', () => {
      const [newBag, __] = fullBag.pull()
      expect(newBag.contents).toEqual([1, 3])
    })

    it('returns the removed item', () => {
      const [__, removed] = fullBag.pull()
      expect(removed).toBe(2)
    })

    it('puts the removed item in the removed list', () => {
      const [newBag, removedItem] = fullBag.pull()
      expect(newBag.removed).toEqual([removedItem])
    })
  })

  it('can pull and return a random item using the sampler', () => {
    const bag = new Bag([1, 2, 3], [4, 5, 6], secondItemSampler)
    expect(bag.pullAndReplace()).toBe(2)
  })

  it('can have items added', () => {
    const bag = Bag.withContents(1)
    expect(bag.add(2).contents).toEqual([1, 2])
  })

  it('can have multiple items added', () => {
    const bag = Bag.withContents(1)
    expect(bag.addMultiple([2, 3]).contents).toEqual([1, 2, 3])
  })
})
