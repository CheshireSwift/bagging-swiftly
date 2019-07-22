import React from 'react'
import { ChipBag, startingChips, Chip } from '../chips'
import {
  addItemToBag,
  createAndReturnBag,
  drawItemFromBag,
  getBag,
} from './apiClient'
import { ChipRender } from './ChipRender'
import Bag from '../../bag/Bag'
import _ from 'lodash'

const createBagContaining = async (contents: Chip[]) => {
  const { bagId } = await createAndReturnBag()
  await addItemToBag(bagId, contents)
  return bagId
}

const newPlayArea = async () => {
  const bagId = await createBagContaining(startingChips)
  window.location.search = `?bag=${bagId}`
}

export const App: React.FunctionComponent<{}> = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const bagId = urlParams.get('bag')

  const [bag, setBag] = React.useState<ChipBag>()
  const updateBagWithSerialized = _.flow([Bag.fromJsonable, setBag])
  React.useEffect(() => {
    if (bagId) {
      getBag(bagId).then(updateBagWithSerialized)
    }
  }, [bagId])

  const body =
    !bagId || !bag ? (
      <>No bag loaded</>
    ) : (
      <>
        <div style={{ fontSize: 36 }}>💰 {bag.contents.length}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', padding: 16 }}>
          {bag.removed.map((chip, i) => (
            <ChipRender key={i} chip={chip} />
          ))}
        </div>
        <button
          onClick={() => {
            drawItemFromBag(bagId).then(({ bag }) =>
              updateBagWithSerialized(bag)
            )
          }}
        >
          Draw
        </button>
        <button
          onClick={() =>
            addItemToBag(bagId, { color: 'legend' }).then(
              updateBagWithSerialized
            )
          }
        >
          Add Legend
        </button>
      </>
    )

  return (
    <div>
      {body}
      <button onClick={newPlayArea}>New</button>
    </div>
  )
}

export default App
