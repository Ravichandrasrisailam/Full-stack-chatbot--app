Fullstack AI Chatbot Application
A responsive full-stack web application featuring user authentication (login/registration) and an interactive chatbot powered by the Google Gemini AI. Built from scratch using React for the frontend and Node.js with Express.js for the backend, connecting to a MongoDB database.

🚀 Features
User Authentication: Secure user registration and login system.

AI Chatbot: Engage in conversations with an AI-powered chatbot.

Real-time Interaction: Seamless chat experience with message display and input.

Conversational Context: The chatbot maintains context for more coherent discussions.

Responsive Design: Optimized for various screen sizes (desktop and mobile) using custom CSS.

💻 Technologies Used
Frontend (Client):

React.js: For building dynamic and responsive user interfaces.

JavaScript (ES6+): Core language for frontend logic.

Custom CSS: For styling the application with a modern, sleek aesthetic.

Backend (Server):

Node.js: JavaScript runtime environment.

Express.js: Fast, unopinionated, minimalist web framework for Node.js.

MongoDB: NoSQL database for storing user data.

Mongoose: MongoDB object data modeling (ODM) for Node.js.

bcrypt.js: For secure password hashing.

jsonwebtoken (JWT): For user authentication and authorization.

@google/generative-ai: Official Node.js client library for interacting with the Google Gemini API.

dotenv: For managing environment variables.

cors: For enabling Cross-Origin Resource Sharing.

⚙️ How to Run Locally
Clone the repository:

git clone <your-repository-url>
cd fullstack-chatbot-app

(Replace <your-repository-url> with the URL of your GitHub repository.)

Backend Setup:

Navigate to the server directory: cd server

Install dependencies: npm install

Create a .env file in the server directory with your configurations:

MONGO_URI=your_mongodb_connection_string_here
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=supersecretjwtkeythatyouwillchangeinproduction
PORT=5000

(Obtain MONGO_URI from MongoDB Atlas and GEMINI_API_KEY from Google AI Studio. JWT_SECRET can be any strong random string.)

Start the backend server: node server.js

Frontend Setup:

Open a new terminal and navigate to the client directory: cd ../client

Install dependencies: npm install

Start the React development server: npm run dev

Access the Application:

Open your web browser and navigate to http://localhost:5173 (or the address provided by npm run dev).

You can register a new user and then log in to use the chatbot.
