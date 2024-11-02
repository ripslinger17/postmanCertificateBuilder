# PSL Certificate Builder
During my workshops experience, aside from Postman Workshops (like API 101: API Fundamentals, API 102: Building Workflows with APIs, API 103: Building Applications with APIs, etc.) I have been giving certificates to the students who have completed the (other) workshop. I have been using Canva to create the certificates and then sending them to the students. This process was time-consuming and I had to create a new certificate for every student. So, I thought of creating a script that will generate the certificates for me and send them to the students.


## Features
- [x] Generate Certificate
- [x] In PDF format
- [x] Can customise the Event name
- [x] Allows to choose between Postman Student Leader and Postman Student Expert
- [x] Uses json format to store the data


## How to setup

1. *Pull a COFFEE* ☕
2. Clone the repository
3. Navigate to the repository. Run `npm install` (make sure you have NodeJS installed)
4. Create a folder by running this command `mkdir certificates`
5. Create a (dot)env file and add the following details
```txt
EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=EMAIL_PASSWORD
```
Create **App Password** for your email account and use that password in the `EMAIL_PASS` field. This is required to send the email. (I have used Gmail to send the email. It is recommended to use Gmail).
- If you are using Linux or MacOS, you can use the code as it is.
- If you are using Windows, you need to `Uncomment` `Line 57` to `Line 66` and `Comment` `Line 48` to `Line 54` in the `index.js` file.
6. Add data in the `data.json` file in the following format
```json
[
    {
        "name": "Ripslinger",
        "email": "ripslinger@email.com"
    },
    {
        "name": "April",
        "email": "april@email.com"
    }
]
```
7. Run the command `node index.js`
8. Enter your name
9. Select your role (Postman Student Leader or Postman Student Expert)
10. Enter the event name
11. The certificates will be generated and sent to the email addresses mentioned in the `data.json` file


## Contibution

Feel free to contribute to this project and help me to make it better. You can also suggest new features which you think should be added to this project.
You can also suggest new designs for the certificate (in HTML and CSS). I will be happy to implement them.

## Contributors
- [Smit](https://github.com/ripslinger17/)
- [Riya](https://github.com/Riyapatel1224)