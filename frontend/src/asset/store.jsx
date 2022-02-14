import React from 'react'

export const StoreContext = React.createContext(null);

export default function StoreProvider (children) {
  const [id, setId] = React.useState(0);
  const store = {
    id: [id, setId]
  }
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
