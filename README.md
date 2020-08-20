# To run the app in development

1. Run `npm install` from the **root**
2. run `npm run server:dev` from the root

## Set environment variables

You can create a .env file in your root project folder and add theses configurations. Be sure to modify the values beforehand. **_Never commit .env file to github._**

```bash
PORT=5000
NODE_ENV = development
MONGO_URI = <YOUR_MONGO_URI> (Only if you use a hosted database)

JWT_SECRET= <JWT_SECRET>
JWT_EXPIRES_IN=<JWT_EXPIRATION_DATE> (Ex : 90d )

COOKIE_EXPIRES_IN = <COOKIE_EXPIRATION_Date> (Ex : 90)

//For MailTrap. You will need to create a MailTrap account
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=<YOUR_MAILTRAP_EMAIL_USERNAME>
EMAIL_PASSWORD=<YOUR_MAILTRAP_EMAIL_Password>
```

# To import/delete development data to/from your database

**To Import Data** Run `npm run import-data`,
**To Delete Data** Run `npm run delete-data`

# Handy Resources

- [Nodejs documentation](https://nodejs.org/en/docs/)
- [Express documentation](http://expressjs.com/)
- [MongoDB documentation](https://docs.mongodb.com/manual/)
- [Mongoose documentation](https://mongoosejs.com/docs/guide.html)
- [Best practices for REST api design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)

# Api Documentation

-[Growers Brains documentation API](https://documenter.getpostman.com/view/12095324/T1LTfjXD?version=latest)
