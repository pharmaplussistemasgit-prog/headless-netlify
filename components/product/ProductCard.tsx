'use client';

import { MappedProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Snowflake, FileText, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: MappedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="h-full border-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group rounded-2xl overflow-hidden relative flex flex-col bg-white">

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.discountPercentage && (
          <span className="bg-[#FFD700] text-black text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
            -{product.discountPercentage}%
          </span>
        )}
        {product.isRefrigerated && (
          <span className="bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-blue-50">
            <Snowflake className="w-3 h-3" /> Frío
          </span>
        )}
      </div>

      <CardContent className="p-0 flex flex-col flex-grow relative">
        {/* Imagen */}
        <div className="relative h-48 w-full bg-white p-4 flex items-center justify-center overflow-hidden pt-6">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-grow bg-white">

          {/* Metadata */}
          <div className="mb-2">
            {product.brand && (
              <span className="text-[10px] font-extrabold text-[#003876] uppercase tracking-wider block mb-1 opacity-70">
                {product.brand}
              </span>
            )}
            <Link href={`/producto/${product.slug}`} className="block">
              <h4 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 min-h-[42px] group-hover:text-[var(--color-primary-blue)] transition-colors">
                {product.name}
              </h4>
            </Link>
          </div>

          {/* Price & Action Area - Pushed to bottom */}
          <div className="mt-auto pt-4 flex items-end justify-between gap-3">
            <div className="flex flex-col">
              {product.isOnSale && (
                <span className="text-[11px] text-gray-400 line-through decoration-gray-400 mb-0.5 font-medium">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
              <span className={cn(
                "text-xl font-extrabold tracking-tight",
                product.isOnSale ? "text-[#E63946]" : "text-[#003876]"
              )}>
                {formatPrice(product.price)}
              </span>
            </div>

            <Button
              disabled={!product.isInStock}
              className={cn(
                "h-10 px-4 rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-2",
                product.isInStock
                  ? "bg-[var(--color-pharma-blue)] hover:bg-[var(--color-blue-classic)] text-white hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200"
              )}
            >
              {product.isInStock ? (
                <>
                  <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                  <span className="hidden sm:inline">Agregar</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-[10px] uppercase tracking-wide">Agotado</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}