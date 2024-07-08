import fs from 'fs';
// const fs = require('fs');

// import fs from 'fs/promises';

// // readFile() - callback
// fs.readFile('./test.txt', 'utf8', (err, data) => {
//   if (err) throw err;
//   console.log(data);  
  
//    queueMicrotask(() =>{
//          console.log("filecall 1");
//          // queueMicrotask((() => console.log("filecall 2")))
//      })
// });

// // readFileSync() - Synchronous version

async function synncFileRead(){
  const data = fs.readFileSync('./test2.txt', 'utf8');
  console.log(data);
  console.log("data");
}
synncFileRead();
console.log("after data");

// setTimeout(() => {
//     console.log("fede");
//     console.log("fede");
//     console.log("fede");
//     console.log("fede");
// },1)

// // const data2 = fs.readFileSync('./test2.txt', 'utf8');
// // console.log("2");

// // const data3 = fs.readFileSync('./test2.txt', 'utf8');
// // console.log("3"+data3);

// async function myapi(){
//     await fetch("https://official-joke-api.appspot.com/random_joke").then((data) => {
//         console.log(data.json());
//     })
//     console.log("a");
//   }
//   myapi()
//   console.log("dedd");

// console.log("wsdw");
// const readFile =  () => {
//     try {
//       fs.readFile('./test.txt', 'utf8').then(data => console.log(data))
//       console.log("in the function");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   readFile();
//   console.log("after function");


  
//   // writeFile()
  
//   const writeFile =  () => {
//     try {
//        fs.writeFile('./test.txt', 'Hello, I am writing to this file');
//       console.log('File written to...')
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   // appendFile()
//   const appendFile =  () => {
//     try {
//        fs.appendFile('./test.txt', '\nThis is appended text')
//       console.log('File appended to...');
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   writeFile();
//   appendFile();
//   readFile();