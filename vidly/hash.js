const bcrypt = require('bcrypt')

// bcrypt demo
// what is a salt?
// e.g.
// 1234 -> abcd
// cant use hashed password to find original password
// but can brute force common passwords and find a match that way
// salt is a random string that is added before or after each hash so each time it is different

async function run() {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('1234', salt);
    console.log(salt);
    console.log(hashed);
};

run();