import React from "react";
import { getBag } from "./apiClient";
import { SerializableBag } from "../../bag/Bag";

export const useBag = <T>(bagId: string | null): SerializableBag<T> | undefined => {
  const [bag, setBag] = React.useState<SerializableBag<T>>()
  React.useEffect(() => {
    if (bagId) {
      getBag<T>(bagId).then(setBag)
    }
  }, [bagId])

  return bag
}
