'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  genericName: string | null;
  manufacturer: string;
  price: number;
  image: string | null;
  quantity: number;
  requiresPrescription: boolean;
  dosageForm: string | null;
  strength: string | null;
  packSize: string | null;
  maxQuantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'everapharm_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = (product: any, quantity: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity if item already in cart
        return currentItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxQuantity) }
            : item
        );
      }

      // Add new item to cart
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        genericName: product.genericName,
        manufacturer: product.manufacturer,
        price: parseFloat(product.price),
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        quantity: quantity,
        requiresPrescription: product.requiresPrescription,
        dosageForm: product.dosageForm,
        strength: product.strength,
        packSize: product.packSize,
        maxQuantity: product.inventory?.availableQuantity || 99,
      };

      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => currentItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const getCartItem = (productId: string) => {
    return items.find(item => item.productId === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
        getCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 