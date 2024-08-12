const { User } = require('../user');
const { Meeting } = require('../meeting');
const { Room } = require('../room');


exports.testUsers = [
        new User(
            "Omeed",
            "Mariani",
            "okm5046@psu.edu",
            "35f749ac-91d1-4153-80db-0278239e6fba",
        ),
        new User(
            "Sean",
            "Spencer",
            "sqs6434@psu.edu",
            "e4c21773-9a68-4172-80b9-09f9140bb8c4",
        ),
        new User(
            "James",
            "Marasco",
            "jcm6309@psu.edu",
            "df71a80d-250c-4fbf-9355-4a907e31c448a",
        ),
        new User(
            "Lando",
            "Norris",
            "lando@f1.com",
            "ca71464b-997e-44c3-ba06-133e58d5c5b2",
        ),
        new User(
            "Fernando",
            "Alonso",
            "alonso@f1.com",
            "dca207c8-5ed4-461f-9feb-ed0ea5c78d75",
        ),
        new User(
            "Lewis",
            "Hamilton",
            "hamiltono@f1.com",
            "4d4c5fae-c795-4691-8884-1e0901cc140c",
        )
]