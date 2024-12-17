# AeroQuiz

Fullstack Application

# 1. Frontend:

1. npm init vite@latest . (creates project in same folder)

## Installing dependencies:

Dependencies:

```
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome bootstrap react react-bootstrap react-icons react-router-dom react-dom
```

Dev Dependencies:

```
npm install --save-dev @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh sass vite
```

## To run:

cd AeroQuiz/frontend

```
npm run dev
```

# Customize:

## Cleanup & customization:

Also, public has been moved to root folder (frontend/public/). This is for your static files.

Delete everything in src/, except: App.jsx & main.jsx

Create folders in src/ :

```
mkdir Components Pages scss
```

The styles.scss file:

```
// https://getbootstrap.com/docs/5.3/getting-started/vite/
// Custom.scss
// Option A: Include all of Bootstrap
// $body-bg: #ffffff; // Set your desired background color

@import '../../node_modules/bootstrap/scss/bootstrap';
// Include any default variable overrides here (though functions won't be available)

// Then add additional custom code here Like Google Fonts:
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&family=Roboto+Condensed:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Protest+Revolution&display=swap');

// Import your own SCSS files
// @import './sticky-footer.scss';

```

import './scss/styles.scss'; inside main.jsx

touch sticky-footer.scss

```
#root {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
#root main {
  flex: 1 0 auto; /* This tells the browser to make the main content grow and shrink as needed, but not to shrink less than its base size */
}
#root footer {
  flex-shrink: 0; /* This tells the browser that the footer should not shrink if there is not enough space */
}
```

# How to RUN:

### For local frontend: cd into frontend folder and:

```
npm run dev
```

### For local backend: cd into backend folder and:

```
npm run dev
```

### Starting both frontend and backend (dev dep concurrently):

cd into root project and:

```
npm start
```

---

# MongoDB

### Import Dummy Data to MongoDB Atlas

1. Open a terminal and cd into the dummy data's position:

```
cd /path/to/directory
```

2. Run the mongoimport command:

```
mongoimport --uri "mongodb+srv://nikolaikocev:<PASSWORD>@cluster0.3iaae.mongodb.net/aeroquiz" --collection users --type json --file users.json --jsonArray
```

### Command breakdown

--uri: The connection string to your MongoDB Atlas cluster.

Replace PASSWORD with your actual password.
The database name is aeroquiz.

--collection users: The name of the collection where the data will be imported.

--type json: Specifies the file type (json in this case).

--file users.json: The file to import.

--jsonArray: Indicates that the file contains an array of JSON objects.

# API Documentation:

The AeroQuiz API provides functionality for managing quiz questions, topics, and related data. Below is a detailed explanation of available endpoints.

BASE URL:

- Local Development: `http://localhost:5000/api/v1/questions`

## API Endpoints Table

| API Endpoint | Method   | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| `/`          | `POST`   | Create one or more questions in the database.   |
| `/`          | `GET`    | Retrieve all questions (with optional filters). |
| `/topics`    | `GET`    | Retrieve a list of all unique topics.           |
| `/:topic`    | `GET`    | Retrieve all questions for a specific topic.    |
| `/:id`       | `DELETE` | Delete a specific question by its ID.           |
| `/`          | `DELETE` | Delete all questions from the database.         |

---

### 1. Add Questions (POST)

- **Endpoint**: `/`
- **Method**: `POST`
- **Body (raw JSON)**:

```json
[
  {
    "topic": "Meteorology",
    "questionText": "What is the primary cause of turbulence?",
    "answers": [
      { "text": "Temperature changes", "isCorrect": false },
      { "text": "Pressure variations", "isCorrect": false },
      { "text": "Wind shear", "isCorrect": true },
      { "text": "Humidity levels", "isCorrect": false }
    ],
    "questionType": "multiple-choice",
    "difficulty": "medium",
    "level": "ATPL"
  },
  {
    "topic": "Navigation",
    "questionText": "What instrument is used to measure altitude?",
    "answers": [
      { "text": "Altimeter", "isCorrect": true },
      { "text": "Airspeed Indicator", "isCorrect": false },
      { "text": "Vertical Speed Indicator", "isCorrect": false },
      { "text": "Compass", "isCorrect": false }
    ],
    "questionType": "multiple-choice",
    "difficulty": "easy",
    "level": "ATPL"
  }
]
```

### Response example:

```json
{
  "status": "success",
  "results": 1,
  "data": {
    "questions": [
      {
        "_id": "6532abc456def7890fed1234",
        "topic": "Meteorology",
        "questionText": "What is the primary cause of turbulence?",
        "answers": [
          { "text": "Temperature changes", "isCorrect": false },
          { "text": "Pressure variations", "isCorrect": false },
          { "text": "Wind shear", "isCorrect": true },
          { "text": "Humidity levels", "isCorrect": false }
        ],
        "questionType": "multiple-choice",
        "difficulty": "medium",
        "level": "ATPL",
        "createdAt": "2024-06-16T14:23:12.789Z"
      }
    ]
  }
}
```

---

### 2. Retrieve All Questions (GET /)

- **Endpoint**: `/`
- **Method**: `GET`

**Description**: Retrieve all questions with optional filters.

**Query Parameters**:

- difficulty (e.g. ?difficulty=medium)
- level (e.g. ?level=ATPL)
- topic (e.g. ?topic=Meteorology)
- sort (e.g. ?sort=-difficulty,createdAt)

**Example Request:**

```bash
GET /api/v1/questions?difficulty=medium&level=ATPL&sort=-createdAt
```

**Response Example:**

```json
{
  "status": "success",
  "results": 1,
  "data": {
    "questions": [
      {
        "_id": "6532abc456def7890fed1234",
        "topic": "Meteorology",
        "questionText": "What is the primary cause of turbulence?",
        "answers": [
          { "text": "Temperature changes", "isCorrect": false },
          { "text": "Pressure variations", "isCorrect": false },
          { "text": "Wind shear", "isCorrect": true },
          { "text": "Humidity levels", "isCorrect": false }
        ],
        "questionType": "multiple-choice",
        "difficulty": "medium",
        "level": "ATPL",
        "createdAt": "2024-06-16T14:23:12.789Z"
      }
    ]
  }
}
```

---

### 3. Retrive All Topics (GET /topics)

- **Endpoint**: `/topics`
- **Method**: `GET`

**Description**: Retrieve a list of all unique topics.

**Example Request:**

```bash
GET /api/v1/questions/topics
```

**Response Example:**

```json
{
  "status": "success",
  "results": 3,
  "data": {
    "topics": ["Meteorology", "Navigation", "Principles of Flight"]
  }
}
```

---

### 4. Retrieve Questions by Topic (GET /:topic)

- **Endpoint**: `/:topic`
- **Method**: `GET`

**Description**: Retrieve all questions for a specific topic.

**Example Request:**

```json
GET /api/v1/questions/Meteorology
```

**Response Example:**

```json
{
  "status": "success",
  "results": 1,
  "data": {
    "questions": [
      {
        "_id": "6532abc456def7890fed1234",
        "topic": "Meteorology",
        "questionText": "What is the primary cause of turbulence?",
        "answers": [
          { "text": "Temperature changes", "isCorrect": false },
          { "text": "Pressure variations", "isCorrect": false },
          { "text": "Wind shear", "isCorrect": true },
          { "text": "Humidity levels", "isCorrect": false }
        ],
        "questionType": "multiple-choice",
        "difficulty": "medium",
        "level": "ATPL",
        "createdAt": "2024-06-16T14:23:12.789Z"
      }
    ]
  }
}
```

---

### 5. Delete a Question by ID (DELETE /:id)

- **Endpoint**: `/:id`
- **Method**: `DELETE`

**Description**: Delete a specific question by its unique ID.

**Example Request:**

```json
DELETE /api/v1/questions/6532abc456def7890fed1234
```

**Response Example:**

```json
{
  "status": "success",
  "message": "Question deleted successfully"
}
```

---

### 6. Delete All Questions (DELETE /)

- **Endpoint**: `/`
- **Method**: `DELETE`

**Description**: Delete ALL Questions in the database.

**Example Request:**

```bash
DELETE /api/v1/questions
```

**Response Example:**

```json
{
  "status": "success",
  "message": "All questions deleted successfully"
}
```
