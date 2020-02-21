const request = require('supertest')
const { Genre } = require('../../models/genre')
const User = require('../../models/user')
const mongoose = require('mongoose')
let server;

describe('/api/genres', () => {
    // need to connect then disconnect after each test
    // always execute test in clean state, and if state modified, clean up after
    beforeEach(() => { server = require('../../index') })
    afterEach(async () => {
        await Genre.deleteMany();
        await server.close()
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])

            const res = await request(server).get('/api/genres')

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            // some is method for arrays silly!
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        })
    })

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' })

            await genre.save()

            const res = await request(server).get(`/api/genres/${genre._id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })

        it('should return 404 if invalid id is passed', async () => {

            const res = await request(server).get(`/api/genres/1234`);

            expect(res.status).toBe(404);
        })

        it('should return 404 if no genre with given id exists', async () => {
            const id = mongoose.Types.ObjectId();

            const res = await request(server).get(`/api/genres/${id}`);

            expect(res.status).toBe(404);
        })
    })

    describe('POST /', () => {
        // writing clean tests:
        // Define happy path. Then in each test, we change one parameter
        // that clearly aligns with name of test.

        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name })
        }

        beforeEach(() => {
            token = new User().generateAuthToken()
            name = 'genre1'
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 400 if genre is less than 3 characters', async () => {
            name = '12'

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a')

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should save genre if it is valid', async () => {
            await exec()

            const genre = await Genre.find({ name: 'genre1' })

            expect(genre).not.toBeNull();
        })

        it('should return genre if it is valid', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        })
    })

    describe('PUT /:id', () => {
        let token;
        let name;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name })
        }

        beforeEach(async () => {
            // populate db with a genre
            genre = new Genre({ name: 'genre1' })
            await genre.save();

            token = new User().generateAuthToken()
            name = 'newName'
            id = genre._id
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 400 if genre is less than 3 characters', async () => {
            name = '12'

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a')

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it('should return 404 if no genre with given id exists', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id', async () => {
            id = '1';

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it('should update the genre if it is valid', async () => {
            await exec()

            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(name);
        })

        it('should return the updated genre if it is valid', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('name', name)
            expect(res.body).toHaveProperty('_id')
        })
    })

    describe('DELETE /:id', () => {
        let token;
        let name;
        let genre;

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + genre._id)
                .set('x-auth-token', token)
        }

        beforeEach(async () => {
            // populate db with a genre
            token = new User({ isAdmin: true }).generateAuthToken()
            name = 'genre1'
            genre = new Genre({ name: name })
            await genre.save();
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        })

        it('should return 404 if no genre with given id exists', async () => {
            name = 'genrelicious'
            const id = mongoose.Types.ObjectId();

            const res = await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)

            expect(res.status).toBe(404)
        })

        it('should return 404 if invalid id', async () => {
            name = 'genrelicious'
            const id = '1';

            const res = await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)

            expect(res.status).toBe(404)
        })
        
        it('should remove genre if id is valid', async () => {
            await exec()

            genre = await Genre.find({ name: 'genre1' })

            expect(genre.length).toBe(0);
        })

        it('should return genre if id is valid', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('name', name)
        })
    })
})