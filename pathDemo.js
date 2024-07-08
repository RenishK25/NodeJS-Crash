import path from 'path';
import url from 'url';

const filePath = './dir1/dir2/test.txt';

// basename()
console.log("basename   " + path.basename(filePath));

// dirname()
console.log("dirname   " + path.dirname(filePath));

// extname()
console.log("extname   " + path.extname(filePath));

// parse()
console.log("parse" );
console.log(path.parse(filePath));

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("import.meta.url   "+import.meta.url); // file:///D:/Apna%20Collage/Node.js/NodeJS-Crash/pathDemo.js
console.log("__dirname    "+__dirname);    // D:\Apna Collage\Node.js\NodeJS-Crash
console.log("__filename    "+__filename);  // D:\Apna Collage\Node.js\NodeJS-Crash\pathDemo.js

// join()
const filePath2 = path.join(__dirname, 'dir1', 'dir2'+ 'test.txt');
console.log(filePath2); // D:\Apna Collage\Node.js\NodeJS-Crash\dir1\dir2test.txt

// resolve()
const filePath3 = path.resolve(__dirname, 'dir1' , 'dir2' , 'test.txt');
console.log(filePath3); // D:\Apna Collage\Node.js\NodeJS-Crash\dir1\dir2\test.txt