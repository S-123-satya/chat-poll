# chat-polling-app
- clone this project using [this link](https://github.com/S-123-satya/chat-poll)
- run following command for running this software into your local machine
- git clone https://github.com/S-123-satya/chat-poll my-chat-poll
- cd my-chat-poll
- npm install
- rename env.sample to just .env
- copy your full mongodb string with username and password in .env file
- npm run start

# happy coding

# Registration guide
- You should use unique username and email (both required ) for the registration along withpassword
- once you register you don't have to login again you will be landed to chat page automatically
- Uses accessToken(expiry 1d) and refreshToken (expirary 30d ) for autherisation and authentication

# Login guide 
- you can use either your emial or username with password but throw an error in the case of both data  absent

# Features
- Both chat and polling functionality are implemented.
- You can choose between multi option selection or single option selection
- seamless user experience with one time login 
- real time chat with socket.io

# Report bug
- [satyaprakash](satyaprakash5056742@gmail.com)
