import React from 'react'
import { ChipBag, startingChips } from '../chips'
import { addItemToBag, createAndReturnBag } from './apiClient'
import { useBag } from './bagHooks'
import { allCards, Deck } from './cards'
import { CardRender } from './CardRender'
import { ChipRender } from './ChipRender'

const createBagContaining = async (contents: unknown[]) => {
  const { bagId } = await createAndReturnBag()
  await addItemToBag(bagId, contents)
  return bagId
}

const newPlayArea = async () => {
  const [deckId, bagId] = await Promise.all([
    createBagContaining(allCards),
    createBagContaining(startingChips),
  ])

  window.location.search = `?deck=${deckId}&bag=${bagId}`
}

type DataError = { error: string }
type RemoteData = { deckId: string; bagId: string; deck: Deck; bag: ChipBag }

const useBagAndDeck = (): DataError | RemoteData => {
  const urlParams = new URLSearchParams(window.location.search)

  const deckId = urlParams.get('deck')
  const bagId = urlParams.get('bag')

  const deck: Deck | undefined = useBag(deckId)
  const bag: ChipBag | undefined = useBag(bagId)

  if (!deckId || !deck) {
    return { error: 'No deck loaded' }
  }

  if (!bagId || !bag) {
    return { error: 'No bag loaded' }
  }

  return { deckId, bagId, deck, bag }
}

const isDataError = (
  remoteData: DataError | RemoteData
): remoteData is DataError => !!(remoteData as any).error

const MainElement = () => {
  const remoteData = useBagAndDeck()
  if (isDataError(remoteData)) {
    return <>{remoteData.error}</>
  }

  const { deck, bag } = remoteData
  return (
    <>
      {deck.contents.length}
      {bag.contents.length}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {deck.contents.map((card) => (
          <CardRender key={card.rank + '_' + card.suit} card={card} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {bag.contents.map((chip, i) => (
          <ChipRender key={i} chip={chip} />
        ))}
      </div>
    </>
  )
}

export const App: React.FunctionComponent<{}> = () => {
  return (
    <div>
      <MainElement />
      <button onClick={newPlayArea}>New</button>
    </div>
  )
}

export default App
