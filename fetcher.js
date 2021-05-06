const {writeFile, access, constants, stat } = require('fs');
const readline = require('readline');
const args = process.argv.splice(2);

const URI = args[0];
const fileName = args[1];

//TODO: check of path exist or not
// stat(fileName, (err, stats)=>{
  
// });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const request = require('request');

request(URI, (error, response, body) => {
  //IF ERROR, THROW ERROR
  if (error) throw error;
  
  //IF NON-200 RESULT, IT WILL DISPLAY STATUS MESSAGE AND EXIT PROGRAM
  if (response.statusCode !== 200) {
    console.log(`${response.request.path.replace('/','')} - ${response.statusMessage}`);
    process.exit();
  }
  
  
  //CHECK FOR FILE EXIST OR NO? IS EXIST AS FOR OVERWRITE
  access(fileName, constants.F_OK, (err) => {
    if (!err) {
      rl.question(`${fileName} already exists. Would you like to overwrite it? (Y/N)'}`, (answer) => {
        if (answer.toLowerCase() === 'n') {
          process.exit();
        }
        console.log(`Working...`);
        
        //IF SUCCESS, WRITE FILE AND SHOW SIZE AND FILENAME ON CALLBACK FUNCTION
        writeFile(fileName, body, (err) => {
          if (err) throw err;
          
          stat(fileName, (err, stats) => {
            console.log(`Downloaded and saved ${stats.size} bytes to ${fileName}.`);
          });
        });
        
        rl.close();
      });
    }
  });
});