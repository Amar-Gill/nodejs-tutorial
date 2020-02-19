const lib = require('../lib')
const db = require('../db')
const mail = require('../mail')

describe('absolute', () => {
    // at least one test for each execution path of a function
    it('should return positive number if input is positive', () => {
        const result = lib.absolute(1);
        expect(result). toBe(1);
    });
    
    it('should return positive number if input is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });
    
    it('should return zero if input is zero', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return the greeting message', () => {
        const result = lib.greet('Ragnaros');
        expect(result).toMatch(/Ragnaros/);
        expect(result).toContain('Ragnaros');
    })
})

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const result = lib.getCurrencies();

        // Too general
        // expect(result).toBeDefined();
        // expect(result).not.toBeNull();

        // Too specific
        // expect(result[0]).toBe('USD')
        // expect(result[1]).toBe('AUD')
        // expect(result[2]).toBe('EUR')
        // expect(result.length).toBe(3);

        // Proper way
        // expect(result).toContain('USD')
        // expect(result).toContain('AUD')
        // expect(result).toContain('EUR')

        // Ideal way
        expect(result).toEqual(expect.arrayContaining(['USD', 'AUD', 'EUR']))
    })
})

describe('getProduct', () => {
    it('should return the product with the given id', () => {
        const result = lib.getProduct(1);

        // will fail. because toBe checks if same object in memory location
        // expect(result).toBe({id: 1, price: 10})

        // expect(result).toEqual({id: 1, price: 10}) // has to be exact match. i.e. two properties only
        // expect(result).toMatchObject({id: 1, price: 10}) // better: looks for jsut matching properties in object of variable length
        expect(result).toHaveProperty('id', 1)
    })
})

describe('registerUser', () => {
    it('should throw if username is falsy', () => {
        // null
        // undefined
        // NaN
        // ''
        // 0
        // false
        const args = [null, undefined, NaN, '', 0, false]
        args.forEach(a => {
            expect(() => {lib.registerUser(a)}).toThrow();
        })
    });

    it('should return a user object if valid username is passed', () => {
        const result = lib.registerUser('Ragnaros')
        expect(result).toMatchObject( {username: 'Ragnaros'} )
        expect(result.id).toBeGreaterThan(0)
    })
})

describe('applyDiscount', () => {
    it('should apply 10% discount if customer has more than 10 points', () => {
        // overwrite db method to mock function to not rely on external db
        db.getCustomerSync = function(customerId) {
            console.log('Fake reading customer...')
            return {id: customerId, points: 20}
        }

        const order = {customerId: 1, totalPrice: 10}
        lib.applyDiscount(order)
        expect(order.totalPrice).toBe(9) 
    })
})

describe('notifyCustomer', () => {
    // interaction testing
    it('should send email to customer', () => {
        // use jest mock functions instead of overwriting manually
        db.getCustomerSync = jest.fn().mockReturnValue( {email: 'a'} ) // equivalent to below
        // overwrite db method to mock function to not rely on external db
        // db.getCustomerSync = function(customerId) {
        //     console.log('Fake reading customer...')
        //     return {email: 'a'}
        // }
        mail.send = jest.fn();
        // let mailSent = false
        // mail.send = function(email, message) {
        //     mailSent = true 
        // }

        lib.notifyCustomer({ customerId: 1})

        // expect(mailSent).toBe(true) // implementation for not using jest mock functions
        expect(mail.send).toHaveBeenCalled(); // using jest mock functions allows us to use this matcher
        expect(mail.send.mock.calls[0][0]).toBe('a')
        expect(mail.send.mock.calls[0][1]).toMatch(/order/)
    })
})
