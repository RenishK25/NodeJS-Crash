import url from "url";


const urlString = "http://localhost:8000/user?username=Renish&password=12346";

const urlObj = new URL(urlString);

console.log(urlObj);

console.log("url.format  " + url.format(urlObj));


// console.log(urlObj.searchParams);

// console.log( new URLSearchParams(urlObj.search));
const params = new URLSearchParams(urlObj.search);
params.append("fullname", "Renish Kalariya");
params.delete("username")

console.log(params.has("password"));
params.forEach((value, key) => (
    console.log(key, value)
))

console.log(params);

// console.log( new URLSearchParams(urlObj.searchParams));