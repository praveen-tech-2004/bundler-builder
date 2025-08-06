document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    const selectedProductsList = document.querySelector('.selected-products-list');
    const progressBar = document.querySelector('.progress-bar');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const discountAmount = document.querySelector('.discount-amount');
    const ctaButton = document.querySelector('.cta-button');
    const bundleStatus = document.querySelector('.bundle-status');

    let selectedProducts = [];
    const DISCOUNT_RATE = 0.30;
    const MIN_ITEMS_FOR_DISCOUNT = 3;

    // Updated SVG icon for the CTA button
    const ctaIconSVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.1905 9.0306L7.19051 14.0306C7.04961 14.1715 6.85852 14.2506 6.65926 14.2506C6.46 14.2506 6.26891 14.1715 6.12801 14.0306C5.98711 13.8897 5.90796 13.6986 5.90796 13.4993C5.90796 13.3001 5.98711 13.109 6.12801 12.9681L10.5974 8.49997L6.12926 4.0306C6.0595 3.96083 6.00415 3.87801 5.9664 3.78686C5.92864 3.69571 5.90921 3.59801 5.90921 3.49935C5.90921 3.40069 5.92864 3.30299 5.9664 3.21184C6.00415 3.12069 6.0595 3.03786 6.12926 2.9681C6.19902 2.89833 6.28185 2.84299 6.373 2.80524C6.46415 2.76748 6.56185 2.74805 6.66051 2.74805C6.75917 2.74805 6.85687 2.76748 6.94802 2.80524C7.03917 2.84299 7.122 2.89833 7.19176 2.9681L12.1918 7.9681C12.2616 8.03786 12.317 8.12072 12.3547 8.21193C12.3925 8.30313 12.4118 8.4009 12.4117 8.49961C12.4116 8.59832 12.392 8.69603 12.354 8.78715C12.3161 8.87827 12.2605 8.961 12.1905 9.0306Z" fill="currentColor"/>
    </svg>`;

    // Updated plus icon for "Add to Bundle" button
    const plusIconSVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.9099 8.5C14.9099 8.69891 14.8309 8.88968 14.6902 9.03033C14.5496 9.17098 14.3588 9.25 14.1599 9.25H9.40991V14C9.40991 14.1989 9.33089 14.3897 9.19024 14.5303C9.04959 14.671 8.85882 14.75 8.65991 14.75C8.461 14.75 8.27023 14.671 8.12958 14.5303C7.98893 14.3897 7.90991 14.1989 7.90991 14V9.25H3.15991C2.961 9.25 2.77023 9.17098 2.62958 9.03033C2.48893 8.88968 2.40991 8.69891 2.40991 8.5C2.40991 8.30109 2.48893 8.11032 2.62958 7.96967C2.77023 7.82902 2.961 7.75 3.15991 7.75H7.90991V3C7.90991 2.80109 7.98893 2.61032 8.12958 2.46967C8.27023 2.32902 8.461 2.25 8.65991 2.25C8.85882 2.25 9.04959 2.32902 9.19024 2.46967C9.33089 2.61032 9.40991 2.80109 9.40991 3V7.75H14.1599C14.3588 7.75 14.5496 7.82902 14.6902 7.96967C14.8309 8.11032 14.9099 8.30109 14.9099 8.5Z" fill="currentColor"/>
    </svg>`;

    // Updated check icon for "Added to Bundle" button and "Added to Cart"
    const checkIconSVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.1905 5.53066L7.19051 13.5307C7.12083 13.6006 7.03804 13.6561 6.94687 13.6939C6.85571 13.7318 6.75797 13.7513 6.65926 13.7513C6.56055 13.7513 6.46281 13.7318 6.37165 13.6939C6.28048 13.6561 6.19769 13.6006 6.12801 13.5307L2.62801 10.0307C2.55825 9.9609 2.5029 9.87807 2.46515 9.78692C2.42739 9.69577 2.40796 9.59807 2.40796 9.49941C2.40796 9.40075 2.42739 9.30305 2.46515 9.2119C2.5029 9.12075 2.55825 9.03793 2.62801 8.96816C2.69777 8.8984 2.7806 8.84306 2.87175 8.8053C2.9629 8.76754 3.0606 8.74811 3.15926 8.74811C3.25792 8.74811 3.35562 8.76754 3.44677 8.8053C3.53792 8.84306 3.62075 8.8984 3.69051 8.96816L6.65988 11.9375L14.1293 4.46941C14.2702 4.32851 14.4613 4.24936 14.6605 4.24936C14.8598 4.24936 15.0509 4.32851 15.1918 4.46941C15.3327 4.61031 15.4118 4.8014 15.4118 5.00066C15.4118 5.19992 15.3327 5.39101 15.1918 5.53191L15.1905 5.53066Z" fill="currentColor"/>
    </svg>`;

    const updateUI = () => {
        let totalItems = 0;
        let subtotal = 0;

        selectedProductsList.innerHTML = '';
        selectedProducts.forEach(product => {
            const listItem = document.createElement('div');
            listItem.classList.add('selected-item');
            listItem.setAttribute('data-id', product.id);
            listItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="item-details">
                    <p class="item-name">${product.name}</p>
                    <p class="item-price">$${(product.price * product.quantity).toFixed(2)}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-input-bundle">
                        <button class="minus-btn" data-id="${product.id}" aria-label="Decrease quantity of ${product.name}">-</button>
                        <input type="number" class="quantity-input" value="${product.quantity}" min="1" readonly aria-label="Quantity of ${product.name}">
                        <button class="plus-btn" data-id="${product.id}" aria-label="Increase quantity of ${product.name}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${product.id}" aria-label="Remove ${product.name} from bundle">
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            `;
            selectedProductsList.appendChild(listItem);
            totalItems += product.quantity;
            subtotal += product.price * product.quantity;
        });

        const numSelectedItems = selectedProducts.length;
        const progressBarWidth = (numSelectedItems / MIN_ITEMS_FOR_DISCOUNT) * 100;
        progressBar.style.width = `${Math.min(progressBarWidth, 100)}%`;

        if (numSelectedItems >= MIN_ITEMS_FOR_DISCOUNT) {
            const discount = subtotal * DISCOUNT_RATE;
            const finalSubtotal = subtotal - discount;
            discountAmount.textContent = `-$${discount.toFixed(2)} (30%)`;
            subtotalAmount.textContent = `$${finalSubtotal.toFixed(2)}`;
            ctaButton.innerHTML = `Add ${totalItems} items to Cart ${ctaIconSVG}`;
            bundleStatus.textContent = 'Bundle complete! Add to cart.';
            ctaButton.disabled = false;
        } else {
            discountAmount.textContent = '-$0.00 (30%)';
            subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
            ctaButton.innerHTML = `Add ${MIN_ITEMS_FOR_DISCOUNT} items to Proceed ${ctaIconSVG}`;
            bundleStatus.textContent = `Add at least ${MIN_ITEMS_FOR_DISCOUNT} products and Save 30%.`;
            ctaButton.disabled = true;
        }
    };

    productCards.forEach(card => {
        const button = card.querySelector('.add-to-bundle-btn');
        const productId = card.dataset.id;
        const productName = card.dataset.name;
        const productPrice = parseFloat(card.dataset.price);
        const productImage = card.querySelector('img').src;

        button.addEventListener('click', () => {
            const index = selectedProducts.findIndex(p => p.id === productId);

            if (index === -1) {
                selectedProducts.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
                button.classList.add('added');
                button.innerHTML = `Added to Bundle ${checkIconSVG}`;
            } else {
                selectedProducts.splice(index, 1);
                button.classList.remove('added');
                button.innerHTML = `Add to Bundle ${plusIconSVG}`;
            }
            updateUI();
        });
    });

    selectedProductsList.addEventListener('click', (event) => {
        const target = event.target;
        const listItem = target.closest('.selected-item');
        if (!listItem) return;

        const productId = listItem.dataset.id;
        const product = selectedProducts.find(p => p.id === productId);

        if (target.classList.contains('plus-btn')) {
            product.quantity++;
        } else if (target.classList.contains('minus-btn')) {
            if (product.quantity > 1) {
                product.quantity--;
            }
        } else if (target.closest('.remove-btn')) {
            const index = selectedProducts.findIndex(p => p.id === productId);
            selectedProducts.splice(index, 1);

            const productCardButton = document.querySelector(`.product-card[data-id="${productId}"] .add-to-bundle-btn`);
            if (productCardButton) {
                productCardButton.classList.remove('added');
                productCardButton.innerHTML = `Add to Bundle ${plusIconSVG}`;
            }
        }
        updateUI();
    });

    ctaButton.addEventListener('click', () => {
        if (selectedProducts.length >= MIN_ITEMS_FOR_DISCOUNT) {
            console.log('Bundle added to cart:', selectedProducts);

            ctaButton.innerHTML = `Added to Cart ${checkIconSVG}`;
            ctaButton.disabled = true;
        }
    });

    updateUI();
});