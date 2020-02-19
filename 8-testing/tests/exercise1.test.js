const {fizzBuzz} = require('../exercise1')

describe('fizzBuzz', () => {
    it('should throw if input is NaN', () => {
        expect(() => {fizzBuzz('lemons')}).toThrow();
        expect(() => {fizzBuzz(null)}).toThrow();
        expect(() => {fizzBuzz(undefined)}).toThrow();
        expect(() => {fizzBuzz({})}).toThrow();
    })

    it('should return FizzBuzz if input divisible by 3 and 5', () => {
        const result = fizzBuzz(15)

        expect(result).toBe('FizzBuzz')
    })

    it('should return Fizz if input divisible by 3', () => {
        const result = fizzBuzz(12)

        expect(result).toBe('Fizz')
    })

    it('should return Buzz if input divisible by 5', () => {
        const result = fizzBuzz(10)

        expect(result).toBe('Buzz')
    })

    it('should return input if input is not divisible by 3 or 5', () => {
        const result = fizzBuzz(8)

        expect(result).toBe(8)
    })
})