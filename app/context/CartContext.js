'use client'

import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product])
  }

  const value = { cart, addToCart }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}