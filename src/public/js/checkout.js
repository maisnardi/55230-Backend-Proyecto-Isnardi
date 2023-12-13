const mp = new MercadoPago("TEST-6210e624-7dc5-430f-88e5-fdee69c521cc", {
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