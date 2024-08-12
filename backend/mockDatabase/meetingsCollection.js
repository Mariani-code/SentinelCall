const { User } = require('../user');
const { Meeting } = require('../meeting');
const { Room } = require('../room');

const dayInSeconds = 24 * 60 * 60;
const sunday = 1724000400;
const monday = sunday + dayInSeconds;
const tuesday = monday + dayInSeconds;
const wednesday = tuesday + dayInSeconds;
const thursday = wednesday + dayInSeconds;
const friday = thursday + dayInSeconds;

exports.testMeetings = [
    new Meeting(
        "Demo Meeting",
        "Regular Suite",
        1724169600000,
        [
            new User(
                "Omeed",
                "Mariani",
                "okm5046@psu.edu",
                "35f749ac-91d1-4153-80db-0278239e6fba",
            ),
            new User(
                "James",
                "Marasco",
                "jcm6309@psu.edu",
                "df71a80d-250c-4fbf-9355-4a907e31c448"
            ),
        ],
        "df71a80d-250c-4fbf-9355-4a907e31c448",
        "bb15e800-365f-4fff-b1ea-262538858d9f"
    ),
    new Meeting(
        "Filter Demo",
        "Regular Suite",
        17241732000000,
        [
            new User(
                "Omeed",
                "Mariani",
                "okm5046@psu.edu",
                "35f749ac-91d1-4153-80db-0278239e6fba",
            ),
        ],
        "df71a80d-250c-4fbf-9355-4a907e31c448",
        "632e86ea-a36d-46a3-a1ba-3410aec2161a"
    ),
    new Meeting(
        "Sean's Demo",
        "Regular Suite",
        thursday * 1000,
        [
            new User(
                "Omeed",
                "Mariani",
                "okm5046@psu.edu",
                "35f749ac-91d1-4153-80db-0278239e6fba",
            ),
            new User(
                "James",
                "Marasco",
                "jcm6309@psu.edu",
                "df71a80d-250c-4fbf-9355-4a907e31c448"
            ),
        ],
        "e4c21773-9a68-4172-80b9-09f9140bb8c4",
        "39db6f29-0811-4de6-a01a-220174360e8f"
    ),
    new Meeting(
        "Sean's Study Group",
        "Regular Suite",
        thursday * 1000 + 600,
        [
            new User(
                "Omeed",
                "Mariani",
                "okm5046@psu.edu",
                "35f749ac-91d1-4153-80db-0278239e6fba",
            ),
        ],
        "e4c21773-9a68-4172-80b9-09f9140bb8c4",
        "20a718e2-4956-45ed-ab81-8a948696a6b3"
    ),
    new Meeting(
        "Filter(Week) Demo",
        "Regular Suite",
        friday * 1000,
        [
            new User(
                "Omeed",
                "Mariani",
                "okm5046@psu.edu",
                "35f749ac-91d1-4153-80db-0278239e6fba",
            ),
            new User(
                "James",
                "Marasco",
                "jcm6309@psu.edu",
                "df71a80d-250c-4fbf-9355-4a907e31c448"
            ),
        ],
        "35f749ac-91d1-4153-80db-0278239e6fba",
        "cb2ec1cd-048d-4ff0-b76b-8b691c9bc072"
    ),

];