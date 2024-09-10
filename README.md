# Node.js & MongoDB Note-Keeping Application 🗒️

### Overview📘

This is a RESTful API for a note-keeping application built with Node.js, Express.js, and MongoDB. The application allows users to perform CRUD operations on notes. Each note includes a title, content, and creation date. The API also supports search and pagination features.

### Features📝

- Create, read, update, and delete notes.
- Search notes by title or content.
- Paginate notes with adjustable limits and pages.
- Handle errors gracefully with appropriate status codes and messages.

  ### Installation
To run this application locally, follow these steps:

1- Clone the Repository:📍


 ```bash
    git clone https://github.com/rahafnasad/MyNoteKeeper_API.git

  ``` 

2- Install Dependencies:📍

Make sure you have Node.js and npm installed. Then, install the required packages:
 ```bash
npm install
``` 

3- Setup MongoDB:📍

Ensure MongoDB is installed and running on your local machine. The application connects to MongoDB at mongodb://localhost:27017.

4- Run the Application:📍

Start the application using the following command:
 ```bash
npm start

```
## API Endpoints
### Create a New Note📌

- Endpoint: POST /notes
  
- Request Body:
 ```bash
{
    "title": "Note Title",
    "content": "Note Content",
    "creationDate": "2024-09-10T00:00:00Z" // Optional, defaults to current date
}

```
- Response:
  
     - Success: 201 Created
     - Error: 400 Bad Request if title or content is missing
 
### Retrieve All Notes 📌

- Endpoint: GET /notes
  
- Query Parameters:
  
     - limit: Number of notes to return (default: 10)
     - page: Page number for pagination (default: 1)
       
- Response:
  
     - Success: 200 OK with list of notes
     - Error: 500 Internal Server Error for server issues

### Search Notes📌
- Endpoint: GET /notes/search
- Query Parameters:
    - query: Search term for title or content
      
- Response
        -  Success: 200 OK with list of matching notes
        -  Error: 500 Internal Server Error for server issues
   

###  Retrieve a Note by ID📌

- Endpoint: GET /notes/:id
- Response:
  
    - Success: 200 OK with note details
    - Error: 404 Not Found if note does not exist

## Update a Note by ID📌
- Endpoint: PUT /notes/:id
- Request Body:
 ```bash
{
    "title": "Note Title",
    "content": "Note Content",
    "creationDate": "2024-09-10T00:00:00Z" // Optional, defaults to current date
}

```
- Response:
  - Success: 200 OK if note updated
  - Error: 400 Bad Request if title or content is missing
  - Error: 404 Not Found if note does not exist

    ###  Delete a Note by ID📌
 - Endpoint: DELETE /notes/:id
 - Response:
   - Success: 200 OK if note deleted
   - Error: 404 Not Found if note does not exist

### Error Handling
All endpoints handle errors gracefully, returning appropriate HTTP status codes and descriptive error messages.
