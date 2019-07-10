import _ from 'lodash'
import React from 'react'
import { addItemToBag, createAndReturnBag, getBag } from './apiClient'
import { Card, Deck, allCards, joker } from './cards'

const createBagAndRedirect = async () => {
  const { bagId } = await createAndReturnBag<Card>()
  await Promise.all(_.map(allCards, (card) => addItemToBag(bagId, card)))
  window.location.search = '?deck=' + bagId
}

export const App = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const deckId = urlParams.get('deck')
  const [deck, setDeck] = React.useState<Deck>()
  React.useEffect(() => {
    if (deckId) {
      getBag<Card>(deckId).then(setDeck)
    } else {
      createBagAndRedirect()
    }
  }, [])

  if (!deckId) {
    return 'Creating deck...'
  }

  if (!deck) {
    return 'No deck loaded'
  }

  return (
    <div>
      {deck.contents.length}
      <pre>{JSON.stringify(deck, null, 2)}</pre>
      <button onClick={() => addItemToBag(deckId, joker)}>Add card</button>
    </div>
  )
}

export default App
