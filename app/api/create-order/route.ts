import { NextResponse } from 'next/server';

const WOO_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, items, total } = body;

        if (!customer || !items || items.length === 0) {
            return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
        }

        // Preparar items para WooCommerce
        const line_items = items.map((item: any) => ({
            product_id: item.id,
            variation_id: item.variationId || undefined,
            quantity: item.quantity,
        }));

        // Preparar datos de la orden
        const orderData = {
            payment_method: 'bacs', // Placeholder, se cambiará en la pasarela
            payment_method_title: 'Transferencia Bancaria',
            set_paid: false,
            billing: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: customer.address,
                city: customer.city,
                state: customer.state,
                postcode: customer.postcode,
                country: 'CO',
                email: customer.email,
                phone: customer.phone,
            },
            shipping: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                address_1: customer.address,
                city: customer.city,
                state: customer.state,
                postcode: customer.postcode,
                country: 'CO',
            },
            line_items: line_items,
            meta_data: [
                {
                    key: '_billing_cedula',
                    value: customer.documentId
                }
            ]
        };

        // Crear orden en WooCommerce
        const response = await fetch(`${WOO_URL}/wp-json/wc/v3/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64'),
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('WooCommerce Error:', data);
            throw new Error(data.message || 'Error al crear la orden en WooCommerce');
        }

        return NextResponse.json({
            success: true,
            orderId: data.id,
            orderKey: data.order_key, // Needed for WooCommerce payment URL
            message: 'Orden creada exitosamente'
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { message: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
