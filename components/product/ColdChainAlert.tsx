import { InfoIcon } from "lucide-react";

import { isColdChain } from "@/lib/coldChain";

export default function ColdChainAlert({ categories, product }: { categories?: any[], product?: any }) {
    // Consolidate check
    if (!isColdChain(categories, product)) return null;

    return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r my-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <InfoIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-blue-700 font-medium">
                        ❄️ Producto de Cadena de Frío
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        Nuestra cadena de frío garantiza 24 horas de frescura.
                        Asegúrate de recibirlo personalmente.
                    </p>
                </div>
            </div>
        </div>
    );
}
