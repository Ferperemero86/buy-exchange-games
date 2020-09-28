# exchange-buy-games

## Description
A web platform for exchanging, buying and selling games between users: 
 - Create an account and start creating your games list, or if you want to buy/exchange a game or simply ask questions you can chat directly to the user. 
 - Post general offers to the rest of the users or directly send an offer to a specific user. 
 - Social features will be added for the users to allow them adding friends, creating events and having more fun. Every user    can create a list of games which can be rated and seen by the rest of users, so the community can make offers to the user aswell.
 - The user profile can be rated to determine how reliable the user is, reducing your concerns about future transactions with other users.
 
## Technologies
 - <b>React hooks + context API</b> State shared withount need of Redux.
 - <b>Next.js</b> Pages rendered serverside for speed and SEO optimization.
 - <b>Node, express</b> 
 - <b>PostgreSQL, Knex, Bookshelf.js</b> For Models and relations. A way to have a related db using objects.
 - <b>Eslint, prettier and Husky</b> For better debugging and avoid pushing mistakes to git.
 - <b>Docker, Docker-compose</b> For easier deployment and testing.
 
## Requeriments
 In order to make it work, you are gonna need: 
  - <b>Docker desktop</b> installed and running in your desktop.
  - <b>Postgresql client</B> (I use Postico free edition which is quite simple) to check tables.
 
 ## Installation
  - Download app from <b>github respository</b>.
  - Open the terminal and go to the <b>app folder</b>.
  - To start the app, type in your terminal: <b>docker-compose up --build</b>
  - Open the browser and go to <b>localhost:3000</b>
