"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    slug: string
    category: string
    quantity: number
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: number
    subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isInitialized, setIsInitialized] = useState(false)
    const supabase = createClient()

    // 1. Initialize cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e)
            }
        }
        setIsInitialized(true)
    }, [])

    // 2. Sync with Supabase on mount and auth changes
    useEffect(() => {
        const syncWithSupabase = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('cart')
                    .eq('id', user.id)
                    .single()

                if (profile?.cart && Array.isArray(profile.cart) && profile.cart.length > 0) {
                    // Merge Supabase cart with local cart (Supabase takes precedence or merge?)
                    // For simplicity, if Supabase has items, we use them, or we could merge.
                    // Let's merge based on ID.
                    setCart(prev => {
                        const localCart = [...prev]
                        const remoteCart = profile.cart as CartItem[]

                        const merged = [...remoteCart]
                        localCart.forEach(localItem => {
                            if (!merged.find(item => item.id === localItem.id)) {
                                merged.push(localItem)
                            }
                        })
                        return merged
                    })
                }
            }
        }

        if (isInitialized) {
            syncWithSupabase()
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                syncWithSupabase()
            }
        })

        return () => subscription.unsubscribe()
    }, [isInitialized, supabase])

    // 3. Persist to localStorage and Supabase on changes
    useEffect(() => {
        if (!isInitialized) return

        localStorage.setItem('cart', JSON.stringify(cart))

        const updateRemoteCart = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase
                    .from('profiles')
                    .update({ cart: cart })
                    .eq('id', user.id)
            }
        }

        const timeoutId = setTimeout(updateRemoteCart, 1000) // Debounce sync
        return () => clearTimeout(timeoutId)
    }, [cart, isInitialized, supabase])

    const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
        toast.success(`${product.name} added to cart!`)
        setCart(prev => {
            const existingItem = prev.find(item => item.id === product.id)
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            return [...prev, { ...product, quantity }]
        })
    }, [])

    const removeFromCart = useCallback((id: string) => {
        setCart(prev => prev.filter(item => item.id !== id))
        toast.info('Item removed from cart')
    }, [])

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) return
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ))
    }, [])

    const clearCart = useCallback(() => {
        setCart([])
    }, [])

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
