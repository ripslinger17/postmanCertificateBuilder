const puppeteer = require('puppeteer');
const data = require('./data.json');
const inquirer = require('inquirer').default;
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function getUserInput() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Enter Organizer's Name",
        },
        {
            type: 'list',
            name: 'role',
            message: 'Choose your Role at Postman Student:',
            choices: ['Postman Student Expert', 'Postman Student Leader']
        },
        {
            type: 'input',
            name: 'course',
            message: "Enter Event's Name",
        }
    ]);

    return answers;
}

const imageBase64 = fs.readFileSync(path.resolve(__dirname, './images/postman.svg'), 'base64');

// Define an async function outside the loop
async function createPDF(participantData, index, userInput) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Certificate</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Crimson Text", serif;
      }
      #certificate {
        width: 800px;
        height: 500px;
        border: 2px solid black;
        margin: 125px auto;
        text-align: center;
        position: relative;
      }
      #postman-logo {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 40px;
        left: 20px;
      }
      #postman {
        font-size: 70px;
        margin-top: 40px;
      }
      .crimson-text-semibold {
        font-family: "Crimson Text", serif;
        font-weight: 600;
        font-style: normal;
      }
      #event {
        font-size: 30px;
        margin-top: -55px;
      }
      #line {
        width: 15%;
        margin-top: 5px;
      }
      #participant-name {
        font-size: 25px;
        margin-top: 20px;
      }
      #underline {
        width: 50%;
        margin-top: -25px;
      }
      #award-line {
        font-size: 12px;
        margin-top: 10px;
      }
      #course-name {
        font-size: 25px;
        margin-top: 10px;
      }
      #organizer-taging-line {
        font-size: 12px;
        margin-top: 10px;
      }
      #org-underline {
        width: 30%;
        margin-top: -15px;
      }
      #organizer-post {
        font-size: 15px;
        margin-top: -5px;
        z-index: 1;
      }
      .waves {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        z-index: -1;
      }

      .waves svg {
        position: relative;
        display: block;
        width: calc(300% + 1.3px);
        height: 142px;
      }

      .waves .shape-fill {
        fill: #fe6c37;
      }
      .waves2 {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        transform: rotate(180deg);
        z-index: -1;
      }

      .waves2 svg {
        position: relative;
        display: block;
        width: calc(300% + 1.3px);
        height: 142px;
      }

      .waves2 .shape-fill2 {
        fill: #fe6c37;
      }
    </style>
  </head>
  <body>
    <div id="certificate">
      <div class="waves">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            class="shape-fill"
          ></path>
        </svg>
      </div>
      <div id="head">
        <img src="data:image/svg+xml;base64,${imageBase64}" alt="postman" id="postman-logo">
        <h1 id="postman" class="crimson-text-semibold">POSTMAN</h1>
        <p id="event"><b>STUDENT EVENT</b></p>
      </div>
      <hr id="line" />
      <div id="content">
        <p id="greet-line">THIS CERTIFICATE IS PRESENTED TO</p>
        <p id="participant-name"><b>${participantData.name}</b></p>
        <hr id="underline" />
        <p id="award-line">
          In recognition of your attendance and completion of the Postman
          Student Event
        </p>
        <p id="course-name"><b>${userInput.course}</b></p>
      </div>
      <div id="footer">
        <p id="organizer-taging-line">Event Hosted By</p>
        <p id="organizer-name"><b>${userInput.name}</b></p>
        <hr id="org-underline" />
        <p id="organizer-post">${userInput.role}</p>
      </div>
      <div class="waves2">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
            class="shape-fill2"
          ></path>
        </svg>
      </div>
    </div>
  </body>
</html>`;

    // Launch Puppeteer and generate the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    // Generate PDF with unique file name for each participant
    await page.pdf({
        path: `certificates/output${index + 1}.pdf`,  // Save each PDF with a unique name
        format: 'A4',
        landscape: true,
        printBackground: true
    });

    await browser.close();

    console.log(`PDF ${index + 1} created successfully!`);
}

// Main function to handle the process
(async () => {
    const userInput = await getUserInput(); // Get user input

    for (let i = 0; i < data.length; i++) {
        await createPDF(data[i], i, userInput); // Pass user input to createPDF
    }
})();