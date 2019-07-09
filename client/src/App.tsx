import * as React from 'react'
import { addItemToBag, createAndReturnBag, getBag } from './apiClient'
import { Card, Deck, joker } from './cards'

const createBagAndRedirect = () =>
  createAndReturnBag<Card>().then(
    ({ bagId }) => (window.location.search = '?deck=' + bagId)
  )

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

  return (
    <div>
      <pre>{JSON.stringify(deck, null, 2)}</pre>
      <button onClick={() => addItemToBag(deckId as string, joker)}>
        Add card
      </button>
    </div>
  )
}

export default App
