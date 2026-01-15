export function isColdChain(categories: any[] | undefined | null, product?: any): boolean {
    // 1. Check Categories (Existing logic)
    if (categories && Array.isArray(categories)) {
        const hasCategory = categories.some((cat) => {
            const slug = cat.slug?.toLowerCase() || "";
            const name = cat.name?.toLowerCase() || "";
            return (
                slug === "cadena-de-frio" ||
                name.includes("cadena de frío") ||
                name.includes("cadena de frio") ||
                slug.includes("cadena-de-frio")
            );
        });
        if (hasCategory) return true;
    }

    // Capture product data if passed (handling different structures)
    if (!product) return false;

    // 2. Check Meta Data (matches ColdChainSection logic)
    if (product.meta_data && Array.isArray(product.meta_data)) {
        const coldMeta = product.meta_data.find((m: any) => m.key === '_cadena_de_frio' || m.key === 'cadena_frio');
        if (coldMeta && (coldMeta.value === 'yes' || coldMeta.value === 'true' || coldMeta.value === 'on' || coldMeta.value === '1' || coldMeta.value === true)) {
            return true;
        }
    }

    // 3. Keyword fallback (matches ColdChainSection logic + camelCase support)
    const name = product.name || "";
    const description = product.short_description || product.description || product.shortDescription || "";
    const searchStr = (name + ' ' + description).toLowerCase();
    const keywords = ['refriger', 'frio', 'frío', 'never', 'insulina', 'vacuna', 'pen', 'vial', 'ampolla'];

    return keywords.some(k => searchStr.includes(k));
}
