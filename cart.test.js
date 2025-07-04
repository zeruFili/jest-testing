const Cart = require('./cart');

describe('Cart', () => {
    let cart;

    beforeEach(() => {
        cart = new Cart();
    });

    describe('addItem()', () => {
        test('adds a new item to the cart', () => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            expect(cart.items).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);
        });

        test('updates quantity if item already exists', () => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            cart.addItem({ name: 'Apple', price: 1.5 }, 3);
            expect(cart.items).toEqual([{ name: 'Apple', price: 1.5, quantity: 5 }]);
        });

        test('throws error for invalid item', () => {
            expect(() => cart.addItem(null, 1)).toThrow("Item must be an object with 'name' and 'price'.");
            expect(() => cart.addItem({ name: 'Apple' }, 1)).toThrow("Item must be an object with 'name' and 'price'.");
        });

        test('throws error for invalid quantity', () => {
            expect(() => cart.addItem({ name: 'Apple', price: 1.5 }, -1)).toThrow("Quantity must be a positive integer.");
            expect(() => cart.addItem({ name: 'Apple', price: 1.5 }, 1.5)).toThrow("Quantity must be a positive integer.");
        });
    });

    describe('removeItem()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 3);
        });

        test('reduces item quantity', () => {
            cart.removeItem('Apple', 2);
            expect(cart.items).toEqual([{ name: 'Apple', price: 1.5, quantity: 1 }]);
        });

        test('removes item when quantity reaches zero', () => {
            cart.removeItem('Apple', 3);
            expect(cart.items).toEqual([]);
        });

        test('throws error if item does not exist', () => {
            expect(() => cart.removeItem('Banana')).toThrow("Item not found in cart.");
        });

        test('throws error if removing more than available', () => {
            expect(() => cart.removeItem('Apple', 4)).toThrow("Cannot remove more items than exist in cart.");
        });
    });

    describe('saveForLater() and moveToCart()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
        });

        test('moves item between cart and saved list', () => {
            cart.saveForLater('Apple');
            expect(cart.savedForLater).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);

            cart.moveToCart('Apple');
            expect(cart.items).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);
            expect(cart.savedForLater).toEqual([]);
        });

        test('throws error if moving item not found in saved items', () => {
            expect(() => cart.moveToCart('Banana')).toThrow("Item not found in saved items.");
        });
        
        test('throws error if saving item not found in cart', () => {
            expect(() => cart.saveForLater('Banana')).toThrow("Item not found in cart.");
        });
    });

    describe('applyCoupon()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 10 }, 2);
        });

        test('applies a valid discount', () => {
            cart.applyCoupon('SAVE10');
            expect(cart.total).toBe(18); // 20 - 10% = 18
        });

        test('ignores invalid coupons', () => {
            cart.applyCoupon('INVALID');
            expect(cart.total).toBe(20);
        });
    });

    describe('clearCart()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            cart.saveForLater('Apple');
            cart.applyCoupon('SAVE10');
        });

        test('resets cart completely', () => {
            cart.clearCart();
            expect(cart.items).toEqual([]);
            expect(cart.savedForLater).toEqual([]);
            expect(cart.total).toBe(0);
        });
    });
});
