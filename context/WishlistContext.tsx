"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface WishlistItem {
    id: number;
    name: string;
    price: number;
    image: string;
    slug: string;
    category?: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: number) => void;
    isInWishlist: (id: number) => boolean;
    toggleWishlist: (item: WishlistItem) => void;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("saprix_wishlist");
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load wishlist", error);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("saprix_wishlist", JSON.stringify(items));
            localStorage.setItem("wishlistCount", items.length.toString());
            // Dispatch storage event for other components listening to localStorage directly (like Header)
            window.dispatchEvent(new Event("storage"));
        }
    }, [items, mounted]);

    const addItem = (item: WishlistItem) => {
        if (items.some((i) => i.id === item.id)) return;
        setItems((prev) => [...prev, item]);
        toast.success("Agregado a favoritos");
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Eliminado de favoritos");
    };

    const isInWishlist = (id: number) => {
        return items.some((i) => i.id === id);
    };

    const toggleWishlist = (item: WishlistItem) => {
        if (isInWishlist(item.id)) {
            removeItem(item.id);
        } else {
            addItem(item);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                isInWishlist,
                toggleWishlist,
                wishlistCount: items.length,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
