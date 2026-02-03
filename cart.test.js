const Cart = require('./cart');

describe('Cart', () => {
    let cart;

    beforeEach(() => {
        cart = new Cart();
        console.log("Initialized a new cart for testing.");
    });

    describe('addItem()', () => {
        test('adds a new item to the cart', () => {
            console.log("Test: adding a new item.");
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            console.log("Cart items:", cart.getItems());
            expect(cart.items).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);
        });

        test('updates quantity if item already exists', () => {
            console.log("Test: updating quantity of existing item.");
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            cart.addItem({ name: 'Apple', price: 1.5 }, 3);
            console.log("Cart items after update:", cart.getItems());
            expect(cart.items).toEqual([{ name: 'Apple', price: 1.5, quantity: 5 }]);
        });

        test('throws error for invalid item', () => {
            console.log("Test: adding invalid item.");
            expect(() => cart.addItem(null, 1)).toThrow("Item must be provided.");
            expect(() => cart.addItem({ name: 'Apple' }, 1)).toThrow("Item must have a 'price' property.");
        });

        test('throws error for invalid quantity', () => {
            console.log("Test: adding item with invalid quantity.");
            expect(() => cart.addItem({ name: 'Apple', price: 1.5 }, -1)).toThrow("Quantity must be a positive integer.");
            expect(() => cart.addItem({ name: 'Apple', price: 1.5 }, 1.5)).toThrow("Quantity must be a positive integer.");
        });
    });

    describe('removeItem()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 3);
            console.log("Added 3 Apples for testing removeItem.");
        });

        test('reduces item quantity', () => {
            cart.removeItem('Apple', 2);
            console.log("Cart items after removing 2 Apples:", cart.getItems());
            expect(cart.items).toEqual([{ name: 'Apple', price: 1.5, quantity: 1 }]);
        });

        test('removes item when quantity reaches zero', () => {
            cart.removeItem('Apple', 3);
            console.log("Cart items after removing all Apples:", cart.getItems());
            expect(cart.items).toEqual([]);
        });

        test('throws error if item does not exist', () => {
            console.log("Test: removing non-existing item.");
            expect(() => cart.removeItem('Banana')).toThrow("Item not found in cart.");
        });

        test('throws error if removing more than available', () => {
            expect(() => cart.removeItem('Apple', 4)).toThrow("Cannot remove more items than exist in cart.");
        });
    });

    describe('saveForLater() and moveToCart()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            console.log("Added 2 Apples for testing saveForLater and moveToCart.");
        });

        test('moves item between cart and saved list', () => {
            cart.saveForLater('Apple');
            console.log("Saved for later:", cart.savedForLater);
            expect(cart.savedForLater).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);

            cart.moveToCart('Apple');
            console.log("Cart items after moving back:", cart.getItems());
            expect(cart.items).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);
            expect(cart.savedForLater).toEqual([]);
        });

        test('throws error if moving item not found in saved items', () => {
            console.log("Test: moving non-existing item.");
            expect(() => cart.moveToCart('Banana')).toThrow("Item not found in saved items.");
        });
        
        test('throws error if saving item not found in cart', () => {
            console.log("Test: saving non-existing item.");
            expect(() => cart.saveForLater('Banana')).toThrow("Item not found in cart.");
        });
    });

    describe('applyCoupon()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 10 }, 2);
            console.log("Added 2 Apples for coupon test.");
        });

        test('applies a valid discount', () => {
            cart.applyCoupon('SAVE10');
            console.log("Total after applying coupon:", cart.total);
            expect(cart.total).toBe(18); // 20 - 10% = 18
        });

        test('ignores invalid coupons', () => {
            cart.applyCoupon('INVALID');
            console.log("Total after applying invalid coupon:", cart.total);
            expect(cart.total).toBe(20);
        });
    });

    describe('clearCart()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            cart.saveForLater('Apple');
            cart.applyCoupon('SAVE10');
            console.log("Initialized cart with items for clearCart test.");
        });

        test('resets cart completely', () => {
            cart.clearCart();
            console.log("Cart after clearing:", cart.getItems());
            expect(cart.items).toEqual([]);
            expect(cart.savedForLater).toEqual([]);
            expect(cart.total).toBe(0);
        });
    });
});