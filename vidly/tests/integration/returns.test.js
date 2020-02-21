const request = require('supertest')
const User = require('../../models/user')
const Movie = require('../../models/movie')
const Rental = require('../../models/rental')
const moment = require('moment')
const mongoose = require('mongoose')

describe('/api/returns', () => {
    let server;
    let token;
    let customerId;
    let movieId;
    let rental;
    let movie;

    const exec = () => {
        // returning a promise
        return request(server)
            .post('/api/returns/')
            .set('x-auth-token', token)
            .send({ customerId, movieId })
    }

    beforeEach(async () => {
        server = require('../../index')
        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            name: 'awesome_sauce',
            dailyRentalRate: 2,
            numberInStock: 1,
            genre: {
                name: '420blazin'
            }
        })

        await movie.save()

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'Ragnaros',
                number: '42069lol'
            },
            movie: {
                _id: movieId,
                name: 'awesome_sauce',
                dailyRentalRate: 2
            }
        })

        await rental.save()
    })

    afterEach(async () => {
        await Rental.deleteMany()
        await Movie.deleteMany()
        await server.close()
    });

    it('Should return 401 if client is not logged in', async () => {
        token = ''

        const res = await exec();

        expect(res.status).toBe(401);
    })

    it('Should return 400 if customerId is not provided', async () => {
        // can also use delete payload.customerId
        customerId = '';

        const res = await exec()

        expect(res.status).toBe(400);
    })

    it('Should return 400 if movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('Should return 404 if no rental found for customer / movie combination', async () => {
        // change either movieId or customerId
        // movieId = mongoose.Types.ObjectId();
        await Rental.deleteMany()

        const res = await exec();

        expect(res.status).toBe(404);
    })

    it('Should return 400 if rental already processed', async () => {
        // change either movieId or customerId
        rental.dateReturned = new Date();
        rental.save()

        const res = await exec();

        expect(res.status).toBe(400);
    })

    it('Should return 200 if valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    })

    it('Should return rental with dateReturned if valid request', async () => {
        await exec();

        const rentalInDb = await Rental.findOne({ _id: rental._id })

        const diff = new Date() - rentalInDb.dateReturned

        // less than 10 second difference to ensure same time accounting for latency
        expect(diff).toBeLessThan(10 * 1000);
    })

    it('Should return rental with rental fee if valid request', async () => {
        // set dateOut to 7 days
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();

        const rentalInDb = await Rental.findOne({ _id: rental._id })

        expect(rentalInDb.rentalFee).toBe(14);
    })

    it('Should update stock of movie if valid request', async () => {
        await exec();

        const movieInDb = await Movie.findById(movieId)

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    })

    it('Should return updated rental if valid request', async () => {
        const res = await exec();

        // const rentalInDb = await Rental.findById(rental._id)

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(
            ['dateOut', 'dateReturned','rentalFee', 'customer', 'movie']
        ))
    })
})

// POST /api/returns {customerId, movieId}

// Return 401 if client is not logged in
// Return 400 if customerId not provided or not valid
// Return 400 if movieId not provided or not valid
// Return 400 is rental is already processed
// Return 404 if no rental for movie/customer
// 200 for valid request
// calculate dateOut
// calculate rental fee
// update stock
// return rental