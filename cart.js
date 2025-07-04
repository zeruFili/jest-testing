class Cart {
    constructor() {
        this.items = [];
        this.savedForLater = [];
        this.total = 0;
        this.discount = 0;
    }

    // Add item to cart (with validation)
    addItem(item, quantity = 1) {
        if (!item) {
            throw new Error("Item must be provided.");
        }
        if (typeof item !== 'object') {
            throw new Error("Item must be an object.");
        }
        if (!item.name) {
            throw new Error("Item must have a 'name' property.");
        }
        if (item.price == null) {
            throw new Error("Item must have a 'price' property.");
        }
        if (quantity <= 0 || !Number.isInteger(quantity)) {
            throw new Error("Quantity must be a positive integer.");
        }

        const existingItem = this.items.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ ...item, quantity });
        }
        this.calculateTotal();
    }

    // Remove item (or reduce quantity)
    removeItem(itemName, quantity = 1) {
        const existingItem = this.items.find(i => i.name === itemName);
        if (!existingItem) {
            throw new Error("Item not found in cart.");
        }
        if (quantity <= 0 || !Number.isInteger(quantity)) {
            throw new Error("Quantity must be a positive integer.");
        }
        if (existingItem.quantity < quantity) {
            throw new Error("Cannot remove more items than exist in cart.");
        }

        existingItem.quantity -= quantity;
        if (existingItem.quantity <= 0) {
            this.items = this.items.filter(i => i.name !== itemName);
        }
        this.calculateTotal();
    }

    // Move item to "Saved for Later"
    saveForLater(itemName) {
        const itemIndex = this.items.findIndex(i => i.name === itemName);
        if (itemIndex === -1) {
            throw new Error("Item not found in cart.");
        }
        this.savedForLater.push(this.items[itemIndex]);
        this.items.splice(itemIndex, 1);
        this.calculateTotal();
    }

    // Move item back to cart
    moveToCart(itemName) {
        const itemIndex = this.savedForLater.findIndex(i => i.name === itemName);
        if (itemIndex === -1) {
            throw new Error("Item not found in saved items.");
        }
        this.items.push(this.savedForLater[itemIndex]);
        this.savedForLater.splice(itemIndex, 1);
        this.calculateTotal();
    }

    // Apply coupon discount
    applyCoupon(code) {
        const discounts = {
            'SAVE10': 0.10,
            'SAVE20': 0.20,
        };
        this.discount = discounts[code] || 0;
        this.calculateTotal();
    }

    // Clear the entire cart
    clearCart() {
        this.items = [];
        this.savedForLater = [];
        this.total = 0;
        this.discount = 0;
    }

    // Recalculate total (private method)
    calculateTotal() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.total = subtotal * (1 - this.discount);
    }

    // Getters
    getTotal() {
        return parseFloat(this.total.toFixed(2)); // Prevent floating-point errors
    }

    getItems() {
        return [...this.items]; // Return copy to avoid external modifications
    }

    getSavedForLater() {
        return [...this.savedForLater];
    }
}

module.exports = Cart;
