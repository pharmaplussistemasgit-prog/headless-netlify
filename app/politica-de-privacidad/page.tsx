import type { Metadata } from 'next';
import PrivacyText from '@/components/policies/PrivacyText';

export const metadata: Metadata = {
    title: 'Política de Privacidad | PharmaPlus',
    description: 'Política de tratamiento de datos personales.',
};

export default function PrivacidadPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 md:p-12">
                <PrivacyText />
            </div>
        </div>
    );
}
