import { getShippingRates } from '@/lib/shipping';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import SmartCrossSell from '@/components/checkout/SmartCrossSell';

export const metadata = {
    title: 'Finalizar Compra - PharmaPlus',
    description: 'Finaliza tu compra de forma segura en PharmaPlus',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
    const shippingRules = await getShippingRates();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="w-full lg:w-[90%] mx-auto space-y-8">

                {/* 1. Checkout Main Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 lg:p-10 border border-gray-100/50">
                    <div className="w-full lg:w-[90%] mx-auto">
                        <h1 className="text-3xl font-bold italic mb-8">
                            <span className="text-[var(--color-pharma-blue)]">Finalizar</span>{' '}
                            <span className="text-[var(--color-pharma-green)]">Compra</span>
                        </h1>
                        <CheckoutForm shippingRules={shippingRules} />
                    </div>
                </div>

                {/* 2. Recommendations Card (Complementa tu compra con...) - SMART ENGINE */}
                <SmartCrossSell />

            </div>
        </div>
    );
}
