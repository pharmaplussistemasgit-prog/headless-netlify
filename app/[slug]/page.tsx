import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/woocommerce";
import ProductDetails from "@/components/product/ProductDetails";
import { mapWooProduct } from "@/lib/mappers";
import { WooProduct } from "@/types/product";

import { revalidatePath } from "next/cache";

export const revalidate = 60;

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata(props: ProductPageProps) {
    const params = await props.params;
    const product = await getProductBySlug(params.slug);

    if (!product) {
        return {
            title: "Producto no encontrado - PharmaPlus",
        };
    }

    return {
        title: `${product.name} - PharmaPlus`,
        description: product.short_description || product.description || `Compra ${product.name} en PharmaPlus`,
    };
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params;
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    const mappedProduct = mapWooProduct(product as unknown as WooProduct);

    // Fetch related products (same category)
    let relatedProducts: any[] = [];
    if (product.categories && product.categories.length > 0) {
        const { getProducts } = await import("@/lib/woocommerce");
        const categoryId = product.categories[0].id;
        const { products } = await getProducts({
            category: String(categoryId),
            perPage: 10
        });
        // Filter out current product
        relatedProducts = products.filter(p => p.id !== product.id);
    }

    // Mock "Otras personas también vieron"
    let alsoViewedProducts: any[] = [];
    {
        const { getProducts } = await import("@/lib/woocommerce");
        const { products } = await getProducts({ perPage: 8, orderby: 'popularity' });
        alsoViewedProducts = products.filter(p => p.id !== product.id).slice(0, 10);
    }

    return (
        <ProductDetails
            product={mappedProduct}
            relatedProducts={relatedProducts}
            alsoViewedProducts={alsoViewedProducts}
        />
    );
}
