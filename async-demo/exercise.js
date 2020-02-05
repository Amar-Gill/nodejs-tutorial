function getCustomer(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('resolving customer...')
            resolve({id: id, name: 'Zeratul', isGold: true, email: 'email'})
        }, 2000)
    })
}

function getMovies() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('resolving movies...')
            resolve(['movie1', 'movie2'])
        }, 2000)
    })
}

function sendEmail() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('sending email...')
            resolve('Email sent...')
        }, 2000)
    })
}

async function operation(id) {
    try {
        const user = await getCustomer(id)
        console.log(user)
        if (user.isGold) {
            const movies = await getMovies()
            console.log(movies)
            const emailMessage = await sendEmail(user.email, movies)
            console.log(emailMessage)
        }
    } catch (err) {
        console.log(err.message)
    }
}

operation(1)