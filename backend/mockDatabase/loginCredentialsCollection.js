const { User } = require('../user');
const { Meeting } = require('../meeting');
const { Room } = require('../room');


exports.testLoginCreds = [
    {
        email: "okm5046@psu.edu",
        password: "TEst1234",
        isAdmin: false,
        userId: "35f749ac-91d1-4153-80db-0278239e6fba"
    },
    {
        email: "sqs6434@psu.edu",
        password: "TEst1234",
        isAdmin: true,
        userId: "e4c21773-9a68-4172-80b9-09f9140bb8c4"
    },
    {
        email: "jcm6309@psu.edu",
        password: "TEst1234",
        isAdmin: false,
        userId: "df71a80d-250c-4fbf-9355-4a907e31c448a"
    },
    {
        email: "lando@f1.com",
        password: "TEst1234",
        isAdmin: false,
        userId: "ca71464b-997e-44c3-ba06-133e58d5c5b2",
    },
    {
        email: "alonso@f1.com",
        password: "TEst1234",
        isAdmin: false,
        userId: "dca207c8-5ed4-461f-9feb-ed0ea5c78d75",
    },
    {
        email: "hamiltono@f1.com",
        password: "TEst1234",
        isAdmin: false,
        userId: "4d4c5fae-c795-4691-8884-1e0901cc140c",
    }
];