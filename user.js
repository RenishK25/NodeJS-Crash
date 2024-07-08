const users = [
    {
        "id": 1,
        "firstname": "Renish",
        "lastname": "Kalariya",
        "age": 22,
        "email": "renish@gmail.com",
        "password": "renish123"
    },
    {
        "id": 2,
        "firstname": "Meet",
        "lastname": "Trambadiya",
        "age": 24,
        "email": "meet@gmail.com",
        "password": "meet123"
    },
    {
        "id": 3,
        "firstname": "Akash",
        "lastname": "Yadav",
        "age": 26,
        "email": "akash@gmail.com",
        "password": "akash123"
    },
]

function id() {
    let id = Math.max()
    const maxId = users.length ? Math.max(...users.map(u => u.id)) : 0;
    // console.log(users.map(u => u.id));
    console.log(maxId);
        console.log(...users.map(u => u.id));
    // console.log(id);
}
id();
    // console.log(users);