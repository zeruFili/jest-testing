class Cart {
    constructor() {
        this.items = [];
        this.savedForLater = [];
        this.total = 0;
        this.discount = 0;
        console.log("Cart initialized.");
    }

    addItem(item, quantity = 1) {
        console.log(`Adding item: ${JSON.stringify(item)}, Quantity: ${quantity}`);
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
            console.log(`Updated quantity of ${item.name} to ${existingItem.quantity}`);
        } else {
            this.items.push({ ...item, quantity });
            console.log(`Added new item: ${item.name}`);
        }
        this.calculateTotal();
    }

    removeItem(itemName, quantity = 1) {
        console.log(`Removing item: ${itemName}, Quantity: ${quantity}`);
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
        console.log(`Reduced quantity of ${itemName} to ${existingItem.quantity}`);
        if (existingItem.quantity <= 0) {
            this.items = this.items.filter(i => i.name !== itemName);
            console.log(`Removed ${itemName} from cart.`);
        }
        this.calculateTotal();
    }

    saveForLater(itemName) {
        console.log(`Saving item for later: ${itemName}`);
        const itemIndex = this.items.findIndex(i => i.name === itemName);
        if (itemIndex === -1) {
            throw new Error("Item not found in cart.");
        }
        this.savedForLater.push(this.items[itemIndex]);
        this.items.splice(itemIndex, 1);
        console.log(`Moved ${itemName} to saved for later.`);
        this.calculateTotal();
    }

    moveToCart(itemName) {
        console.log(`Moving item back to cart: ${itemName}`);
        const itemIndex = this.savedForLater.findIndex(i => i.name === itemName);
        if (itemIndex === -1) {
            throw new Error("Item not found in saved items.");
        }
        this.items.push(this.savedForLater[itemIndex]);
        this.savedForLater.splice(itemIndex, 1);
        console.log(`Moved ${itemName} back to cart.`);
        this.calculateTotal();
    }

    applyCoupon(code) {
        console.log(`Applying coupon code: ${code}`);
        const discounts = {
            'SAVE10': 0.10,
            'SAVE20': 0.20,
        };
        this.discount = discounts[code] || 0;
        console.log(`Discount applied: ${this.discount * 100}%`);
        this.calculateTotal();
    }

    clearCart() {
        console.log("Clearing the cart.");
        this.items = [];
        this.savedForLater = [];
        this.total = 0;
        this.discount = 0;
    }

    calculateTotal() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.total = subtotal * (1 - this.discount);
        console.log(`Total calculated: ${this.total}`);
    }

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