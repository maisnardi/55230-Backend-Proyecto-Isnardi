const mp = new MercadoPago("TEST-4b9e9049-2ccf-4bd8-818f-ac01d0efac6d", {
    locale: 'es-AR'
});

let count = 0;
document.getElementById('checkout-btn').addEventListener('click', async () => {
    try {
        const price = Number(document.getElementById('amount').innerHTML);
        console.log(price)
        const orderData = {
            title: "Products",
            quantity: 1,
            price: price,
        };

        const response = await fetch('/api/payments/intents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData),
        });

        const preference = await response.json();
        createCheckoutButton(preference.id);
    } catch (error) {
        alert(error.message);
    }
});

const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();
    if (count === 0) {
        const renderComponet = async () => {
            await bricksBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                },
            });
        };
        count++;
        renderComponet();
    }
};