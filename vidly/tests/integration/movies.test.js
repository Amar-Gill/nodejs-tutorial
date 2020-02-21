const request = require('supertest')
const { Genre } = require('../../models/genre')
const User = require('../../models/user')
const Movie = require('../../models/movie')
const mongoose = require('mongoose')
let server;

describe('/api/movies', () => {
    // need to connect then disconnect after each test
    // always execute test in clean state, and if state modified, clean up after
    beforeEach(() => { server = require('../../index') })
    afterEach(async () => {
        await Movie.deleteMany()
        await Genre.deleteMany();
        await server.close()
    });

    describe('GET /', () => {
        it('should return all movies', async () => {
            await Movie.collection.insertMany([
                { name: 'movie1' },
                { name: 'movie2' }
            ])

            const res = await request(server).get('/api/movies')

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            // some is method for arrays silly!
            expect(res.body.some(m => m.name === 'movie1')).toBeTruthy();
            expect(res.body.some(m => m.name === 'movie2')).toBeTruthy();
        })
    })

    describe('GET /:id', () => {
        it('should return a movie if valid id is passed', async () => {
            const movie = new Movie({
                name: 'movie1',
                numberInStock: 1,
                dailyRentalRate: 1,
                genre: {
                    _id: mongoose.Types.ObjectId(),
                    name: '420blazinit'
                }
            })

            await movie.save()

            const res = await request(server).get(`/api/movies/${movie._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', movie.name);
        })

        it('should return 404 if no genre with given id exists', async () => {
            const id = mongoose.Types.ObjectId();

            const res = await request(server).get(`/api/movies/${id}`);

            expect(res.status).toBe(404);
        })

        // cyclic dependency error???????????
        // it('should return 404 if invalid id is passed', async () => {

        //     const res = await request(server).get(`/api/movies/12345678`);

        //     expect(res.status).toBe(404);
        // })
    })

    describe('POST /', () => {
        // writing clean tests:
        // Define happy path. Then in each test, we change one parameter
        // that clearly aligns with name of test.
        let token;
        let name;
        let numberInStock;
        let dailyRentalRate;
        let genre;

        const exec = async () => {
            return await request(server)
                .post('/api/movies')
                .set('x-auth-token', token)
                .send({
                    name: name,
                    numberInStock: numberInStock,
                    dailyRentalRate: dailyRentalRate,
                    genreId: genre._id
                })
        }

        beforeEach(() => {
            token = new User().generateAuthToken()
            name = 'movie1'
            numberInStock = 1
            dailyRentalRate = 1
        })

        beforeEach(async () => {
            genre = new Genre({ name: 'genre1' })
            genre.save()
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 400 if name is less than 3 characters', async () => {
            name = '12'

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if name is more than 50 characters', async () => {
            name = new Array(52).join('a')

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if numberInStock not a positive int', async () => {
            numberInStock = -1;

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if dailyRentalRate not a positive int', async () => {
            dailyRentalRate = -1;

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if genreId not valid', async () => {
            // setting new genre instance in test script so one saved in db does not match
            genre = {
                _id: '1234',
                name: 'genre2'
            }

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 404 if genre with genreId does not exist', async () => {
            // setting new genre instance in test script so one saved in db does not match
            genre = new Genre({ name: 'genre2' })

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should save movie if it is valid', async () => {
            await exec()

            const movie = await Movie.find({ name: name })

            expect(movie).not.toBeNull();
        })

        it('should return movie if it is valid', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
            expect(res.body).toHaveProperty('numberInStock', numberInStock);
            expect(res.body).toHaveProperty('dailyRentalRate', dailyRentalRate);
        })
    })

    describe('PUT /:id', () => {
        let token;
        let movieName;
        let movie;
        let movieId;
        let numberInStock;
        let dailyRentalRate;
        let genreName;
        let genre;
        let genreId;

        const exec = async () => {
            return await request(server)
                .put('/api/movies/' + movieId)
                .set('x-auth-token', token)
                .send({
                    name: movieName,
                    numberInStock: numberInStock,
                    dailyRentalRate: dailyRentalRate,
                    genreId: genreId
                })
        }

        beforeEach(() => {
            // generate auth token
            token = new User({ isAdmin: true }).generateAuthToken()
        })

        beforeEach(async () => {
            // populate db with a genre
            genreName = 'genre1'
            genreId = mongoose.Types.ObjectId();
            genre = new Genre({ _id: genreId, name: genreName })
            await genre.save();

            // populate db with a movie
            movieName = 'movie1'
            numberInStock = 1
            dailyRentalRate = 1
            movie = new Movie({
                name: movieName,
                numberInStock: numberInStock,
                dailyRentalRate: dailyRentalRate,
                genre: {
                    _id: genreId,
                    name: genreName
                }
            })
            await movie.save()
            movieId = movie._id;
        })

        it('should return 401 if client is not logged in', async () => {
            // should return 200 if token provided but returning 500...
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
            expect(res.error.text).toMatch(/.*Access denied.*/)
        })

        it('should return 400 if name is less than 3 characters', async () => {
            // should return 200 if movieName.length>3 but returning 500...
            movieName = '12'

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.error.text).toMatch(/.*name.*/)
            expect(res.error.text).toMatch(/.*length.*/)
        })

        it('should return 400 if name is more than 50 characters', async () => {
            movieName = new Array(52).join('a')

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.error.text).toMatch(/.*name.*/)
            expect(res.error.text).toMatch(/.*length.*/)
        })

        it('should return 400 if numberInStock not a positive int', async () => {
            numberInStock = -1;

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.error.text).toMatch(/.*numberInStock.*/)
            expect(res.error.text).toMatch(/.*larger.*/)
        })

        it('should return 400 if dailyRentalRate not a positive int', async () => {
            dailyRentalRate = -1;

            const res = await exec()

            expect(res.status).toBe(400)
            expect(res.error.text).toMatch(/.*dailyRentalRate.*/)
            expect(res.error.text).toMatch(/.*larger.*/)
        })

        it('should return 400 if invalid genreId - part of request.body', async () => {
            // setting genre to a new Genre instance which is not saved into db
            // genre = new Genre({name: 'newGenre'})
            genreId = '1234';

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 404 if genre with genreId does not exist', async () => {
            // setting genre to a new Genre instance which is not saved into db
            // genre = new Genre({name: 'newGenre'})
            genreId = mongoose.Types.ObjectId();

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid movieId - part of req.params', async () => {
            movieId = '420'

            const res = await exec();

            expect(res.status).toBe(404);
        })

        it('should return movie if it is updated successfully', async () => {
            movieName = "420blazin"

            const res = await exec()

            expect(res.body).toHaveProperty('name', movieName)
        })

        it('should update database if movie is updated successfully', async () => {
            movieName = "420blazin"

            await exec()

            const updatedMovie = await Movie.findById(movie._id)

            expect(updatedMovie.name).toBe(movieName)
        })
    })

    describe('DELETE /:id', () => {
        let token;
        let movieName;
        let movie;
        let movieId;
        let numberInStock;
        let dailyRentalRate;
        let genreName;
        let genre;
        let genreId;

        const exec = async () => {
            return await request(server)
                .delete('/api/movies/' + movieId)
                .set('x-auth-token', token)
        }

        beforeEach(() => {
            // generate auth token
            token = new User({ isAdmin: true }).generateAuthToken()
        })

        beforeEach(async () => {
            // populate db with a genre
            genreName = 'genre1'
            genreId = mongoose.Types.ObjectId();
            genre = new Genre({ _id: genreId, name: genreName })
            await genre.save();

            // populate db with a movie
            movieName = 'movie1'
            numberInStock = 1
            dailyRentalRate = 1
            movie = new Movie({
                name: movieName,
                numberInStock: numberInStock,
                dailyRentalRate: dailyRentalRate,
                genre: {
                    _id: genreId,
                    name: genreName
                }
            })
            await movie.save()
            movieId = movie._id;
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 404 if no movie with given id exists', async () => {
            movieId = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id', async () => {
            movieId = '1234';

            const res = await exec();

            expect(res.status).toBe(404)
        })

        it('should remove movie if id is valid', async () => {
            await exec()

            query = await Movie.find({ name: movieName })

            expect(query.length).toBe(0);
        })

        it('should return movie if id is valid', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('name', movieName)
        })
    })
})