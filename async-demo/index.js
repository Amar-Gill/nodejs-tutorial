// asynchronous does not mean concurrent or multi-threaded

// an async function has function parameters, and extra callback parameter which is a function

// a callback is a function that is called when result of async operation ready
// function getUser(id, callback) {
//     setTimeout(() => {
//         console.log('USER DATA RETRIEVED')
//         callback({id: id, username: 'flare-blitz'})
//     }, 2000);
// }

// const getRepositories = (username, callback) => {
//     setTimeout(() => {
//         console.log(`REPOSITORIES FOR: ${username}`)
//         callback(['repo1', 'repo2', 'repo3']);
//     }, 2000);
// }

// const getCommits = (repo, callback) => {
//     setTimeout(() => {
//         console.log(`COMMITS FOR: ${repo}`)
//         callback(['commit 1', 'commit 2', 'commit 3'])
//     }, 2000)
// }

// 1) CALLBACK HELL - deeply nested code structure
console.log('Before');
// getUser(1, (user) => {
//     console.log(user);
//     getRepositories(user.username, repoArray => {
//         console.log(repoArray)
//         getCommits(repoArray[0], commitArray => {
//             console.log(commitArray)
//             console.log('After');
//         })
//     })
// });

// 2) rewrite using named functions?
// eff that don't like it...

// function displayCommits(commits) {
//     console.log(commits)
// }

// function displayRepositories(repositories) {
//     console.log(repositories)
// }

// function displayUser(user) {
//     console.log(user)
// }

// 3) PROMISES
// promise is an object that holds the eventual result of an asynchronous operation
// three states: pending, fulfilled/resolved, rejected
// pending --> async operation --> (Fulfilled with value || Rejected with error)

// rewrite functions to return promise
function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('RESPONSE RECEIVED FROM GET USER REQUEST')
            resolve({ id: id, username: 'flare-blitzer' })
            // reject(new Error('manz flopt n shit'))
        }, 2000)
    })
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`RESPONSE FOR GET REPOSITORIES OF: ${username}`)
            resolve(['repo1', 'repo2', 'repo3'])
            // reject(new Error('bare flop tingz'))
        }, 2000)
    })
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`RESPONSE FOR GET COMMITS OF: ${repo}`)
            resolve(['commit 1', 'commit 2', 'commit 3'])
            // reject(new Error('hooooolyy'))
        }, 2000)
    })
}

// if function argument of .then should return a value, wrap that value in a promise
// so getRepositories function should return a promise instead
// getUser(1)
//     .then(user => {
//         console.log(user)
//         return getRepositories(user.username) // make sure to return the value!!
//     })
//     .then(repoArray => {
//         console.log(repoArray)
//         // require commits array, but function is async, so should return a promise
//         return getCommits(repoArray[0])
//     })
//     .then(commits => {
//         console.log(commits)
//         console.log('After')
//     })
//     .catch(err => console.log(err.message));

// async await approach

async function displayCommits() {
    try {
        const user = await getUser(1)
        console.log(user)
        const repos = await getRepositories(user.username)
        console.log(repos)
        const commits = await getCommits(repos[0])
        console.log(commits);
        console.log('after')
    } catch (err) {
        console.log(err.message)
    }
}

displayCommits()



// Synchronous implementation - for reference
// console.log('Before');
// const user = getUser(1);
// const repos = getRepos(user);
// const commits = getCommits(repos[0]);
// console.log('After')
