# Northcoders News API

## Overview

Welcome to the my implementation of the Northcoders News API, a backend service designed to provide application data programmatically.  
This API mimics the functionality of real-world platforms like Reddit, allowing front-end applications to interact seamlessly with the database.

## Features

- **GET /api**

  - Explore the available endpoints.

- **GET /api/topics**

  - Retrieve a list of available topics.

- **GET /api/articles/:article_id**

  - Fetch a single article by its ID.

- **GET /api/articles**

  - Browse through a list of articles.

- **GET /api/articles/:article_id/comments**

  - View comments associated with a specific article.

- **POST /api/articles/:article_id/comments**

  - Add a new comment to an article.

- **PATCH /api/articles/:article_id**

  - Update an article's information.

- **DELETE /api/comments/:comment_id**

  - Remove a comment based on its ID.

- **GET /api/users**

  - Retrieve a list of users.

- **GET /api/articles (queries)**
  - Filter and sort articles based on specific criteria.

- **GET /api/users/:username**
  - Fetch a single user by its username.


## Try it Out

To explore the Northcoders News API:

1.  Clone the repository:

        git clone https://github.com/DaniMaron/be-nc-news.git

2.  Navigate to the project directory:

        cd be-nc-news

3.  Install dependencies:

        npm install

4.  Set up the local database:

        npm run setup-dbs

5.  Create the necessary .env files:

        -Create a .env.development file.
        -Create a .env.test file for testing purposes.
        -Into each, add `PGDATABASE=`, followed by the correct database name for that environment
          (see /db/setup.sql for the database names).
        -Double check that these .env files are .gitignored.

6.  Seed the database

        npm run seed

7.  Run tests:

        npm test

8.  Start the server:

        npm start

## Minimum Requirements

Node.js v21.5.0 or higher  
PostgreSQL v8.7.3 or higher

## Additional Information

Link to hosted version: [https://be-nc-news-p9rm.onrender.com/api]

Feel free to explore the API, test different endpoints, and integrate it into your projects. If you have any questions or encounter issues, please reach out to me. Happy coding!
