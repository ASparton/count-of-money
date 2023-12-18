# Count of Money

Made in the context of our studies at **Epitech Bordeaux**, Count of Money is a web application allowing its users to :
- Visualize a personalized selection of cryptocurrencies prices and history
- Consult a personalized selection of the latest articles about cryptocurrencies

## Features

### Authentication
Count of Money supports three types of users:
- Unauthenticated users: Can consult the cryptocurrencies prices and articles selected by the administrator
- Authenicated users: Can have a more personalized experience by selecting the cryptocurrencies and articles type they favor
- Administrator: Can add new cryptocurrencies and articles feed to the app

Email/Password and Github OAuth is supported.

### Articles harvest
In order to make the latest articles available for the users, the administrator can provide XML feeds.
A cron job on the server will be executed every 15 minutes to parse the feed and register the articles into our database.
The administrator can also force the articles harvest instead of waiting for the job to it.

### Cryptocurrencies prices visualization
The administrator can add and configure the cryptocurrencies available in the application.
He just needs to add the cryptocurrency name, code *(for example Bitcoin=BTC)* and an optional image to register a cryptocurrency to the database.
However, instead of registering all the prices history in the database, we use the `ccxt` npm package to fetch the required information.

## Global architecture schema
![image](https://github.com/ASparton/count-of-money/assets/65446617/f95234d7-4b1b-4f24-aa9d-8a4e8562075e)
