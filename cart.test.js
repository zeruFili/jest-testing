const Cart = require('./cart');

describe('Cart', () => {
    let cart;

    beforeEach(() => {
        cart = new Cart();
    });

    describe('addItem()', () => {
        test('adds a new item to the cart', () => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            expect(cart.getItems()).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);
        });

        test('updates quantity if item already exists', () => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            cart.addItem({ name: 'Apple', price: 1.5 }, 3);
            expect(cart.getItems()).toEqual([{ name: 'Apple', price: 1.5, quantity: 5 }]);
        });

        test('throws error for invalid item', () => {
            expect(() => cart.addItem(null, 1)).toThrow("Item must be an object");
            expect(() => cart.addItem({ name: 'Apple' }, 1)).toThrow("'price'");
        });

        test('throws error for invalid quantity', () => {
            expect(() => cart.addItem({ name: 'Apple', price: 1.5 }, -1)).toThrow("positive integer");
            expect(() => cart.addItem({ name: 'Apple', price: 1.5 }, 1.5)).toThrow("integer");
        });
    });

    describe('removeItem()', () => {
        beforeEach(() => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 3);
        });

        test('reduces item quantity', () => {
            cart.removeItem('Apple', 2);
            expect(cart.getItems()).toEqual([{ name: 'Apple', price: 1.5, quantity: 1 }]);
        });

        test('removes item when quantity reaches zero', () => {
            cart.removeItem('Apple', 3);
            expect(cart.getItems()).toEqual([]);
        });

        test('throws error if item does not exist', () => {
            expect(() => cart.removeItem('Banana')).toThrow("Item not found");
        });

        test('throws error if removing more than available', () => {
            expect(() => cart.removeItem('Apple', 4)).toThrow("Cannot remove more");
        });
    });

    describe('saveForLater() and moveToCart()', () => {
        test('moves item between cart and saved list', () => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            cart.saveForLater('Apple');
            expect(cart.getItems()).toEqual([]);
            expect(cart.getSavedForLater()).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);

            cart.moveToCart('Apple');
            expect(cart.getItems()).toEqual([{ name: 'Apple', price: 1.5, quantity: 2 }]);
            expect(cart.getSavedForLater()).toEqual([]);
        });
    });

    describe('applyCoupon()', () => {
        test('applies a valid discount', () => {
            cart.addItem({ name: 'Apple', price: 10 }, 2);
            cart.applyCoupon('SAVE10');
            expect(cart.getTotal()).toBe(18); // 20 - 10% = 18
        });

        test('ignores invalid coupons', () => {
            cart.addItem({ name: 'Apple', price: 10 }, 2);
            cart.applyCoupon('INVALID');
            expect(cart.getTotal()).toBe(20);
        });
    });

    describe('clearCart()', () => {
        test('resets cart completely', () => {
            cart.addItem({ name: 'Apple', price: 1.5 }, 2);
            cart.saveForLater('Apple');
            cart.applyCoupon('SAVE10');
            cart.clearCart();
            expect(cart.getItems()).toEqual([]);
            expect(cart.getSavedForLater()).toEqual([]);
            expect(cart.getTotal()).toBe(0);
        });
    });
});