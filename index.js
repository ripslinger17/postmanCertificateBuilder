/*
   Copyright 2024 Smit

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
const puppeteer = require('puppeteer');
const data = require('./data.json');
const inquirer = require('inquirer').default;
const nodemailer = require('nodemailer');
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

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services as well (e.g., 'hotmail', 'yahoo')
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const imageBase64 = fs.readFileSync(path.resolve(__dirname, './images/postman.svg'), 'base64');

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
        margin: 0 auto;
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

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    await page.pdf({
        path: `certificates/${participantData.name}.pdf`,
        width: '216mm',
        height: '137.5mm',
        printBackground: true
    });

    await browser.close();

    console.log(`PDF ${index + 1} created successfully!`);
}


(async () => {
    const userInput = await getUserInput();

    for (let i = 0; i < data.length; i++) {
        const pdfPath = await createPDF(data[i], i, userInput);
        
        const pathToPDF = path.resolve(__dirname, `certificates/${data[i].name}.pdf`);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: data[i].email,
            subject: `Certificate of Participation - ${userInput.course}`,
            text: `Hello ${data[i].name},\n\nPlease find your certificate for attending ${userInput.course} in attachment.`,
            attachments: [
                {
                    filename: `${data[i].name}.pdf`,
                    path: pathToPDF,
                    contentType: 'application/pdf'
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error: ', error);
            }
            console.log(`Email sent to ${data[i].name}: `, info.response);
        });
    }
})();