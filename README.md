# NeuraForge AI Toolkit

This is a Next.js starter project built in Firebase Studio. It features a variety of AI tools powered by Genkit and is integrated with Firebase for authentication and database services.

## Getting Started Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js (version 18 or later) and npm installed on your computer. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone the repository (or download the source code):**
    If this project is in a Git repository, clone it. Otherwise, make sure you have all the files in a local folder.

2.  **Navigate to the project directory:**
    ```bash
    cd your-project-folder
    ```

3.  **Install dependencies:**
    Run the following command to install all the required packages from `package.json`:
    ```bash
    npm install
    ```

### Firebase Setup

To connect the application to your own Firebase project, you'll need to get your Firebase project's configuration.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Create a new Firebase project or use an existing one.
3.  In your project's settings, find your web app's configuration object. It will look something like this:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIza...",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "...",
      appId: "1:..."
    };
    ```
4.  Copy this configuration into the `src/lib/firebase.ts` file, replacing the existing placeholder configuration.
5.  Enable **Google Authentication** and **Email/Password Authentication** in the Firebase Console under the "Authentication" -> "Sign-in method" tab.
6.  Enable the **Firestore Database** in the Firebase Console.

### Environment Variables

You will need a Gemini API key for some AI functionalities.

1.  **Create a file named `.env` in the root of your project.**
2.  **Add your Gemini API key:**
    Go to the [Google AI Studio](https://aistudio.google.com/app/apikey) to get your API key. Add it to the `.env` file:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    
### Running the Application

1.  **Run the development server:**
    ```bash
    npm run dev
    ```

2.  **Open your browser:**
    Navigate to [http://localhost:9002](http://localhost:9002) to see your application in action.

You are now all set to develop and test the application on your local machine!
