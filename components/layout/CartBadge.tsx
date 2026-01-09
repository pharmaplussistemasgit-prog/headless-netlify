'use client';

import { useCart } from '@/context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function CartBadge() {
    const { cartCount } = useCart();

    if (cartCount === 0) return null;

    return (
        <AnimatePresence>
            <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-[var(--color-pharma-green)] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
                {cartCount}
            </motion.span>
        </AnimatePresence>
    );
}
