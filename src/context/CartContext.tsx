'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/firebase';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedWeight?: string;
  selectedColor?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, quantity?: number, size?: string, weight?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('adrin_cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }
  }, []);

  // Save cart to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('adrin_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity = 1, size?: string, weight?: string, color?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && 
                  item.selectedSize === size && 
                  item.selectedWeight === weight &&
                  item.selectedColor === color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      return [...prev, { product, quantity, selectedSize: size, selectedWeight: weight, selectedColor: color }];
    });
    setIsCartOpen(true); // Auto-open drawer when item is added
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const setCartOpen = (open: boolean) => {
    setIsCartOpen(open);
  };

  const getProductPrice = (item: CartItem) => {
    if (item.selectedColor && item.product.variants && item.product.variants.length > 0) {
      const variant = item.product.variants.find(v => v.color.toLowerCase() === item.selectedColor?.toLowerCase());
      if (variant) return variant.price;
    }
    return item.product.price;
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + getProductPrice(item) * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
