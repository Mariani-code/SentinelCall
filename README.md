**Setup Instructions:**

1. **Install Required Software:**
   - **Node.js** and **npm**
   - **Git**

2. **Create a Local Folder:**
   - Name it: Anything you'd like
   - git clone the repo
  
**INSTALL DEPENDENCIES AND START BACKEND / FRONTEND**

3. **Setup Backend:**
   - Navigate to the `backend` folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the backend server,you may need to adjust the port the backend is listening on depending on your local setup:
     ```bash
     node index.js
     ```

   **Credentials:**
   - **Username:** `admin`
   - **Password:** `admin`

4. **Start Frontend:**
   - Navigate back to the project folder:
     ```bash
     cd sweng-455-project
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

4. **Start Firestore:**
Note that Firestore has API keys visible in this project. It is NOT a concern, these keys are purely for linking to the deployed application, and not for giving any sort of access to information.


   - From backend folder:
     ```bash
     cd backend
     ```
   - Start FireBase Emulator:
     ```firebase emulators:start --project sweng455-phase3
     ```

5. **Visit the Application:**
By default, this application will run on port 3000 at localhost:
- Open any browser
- Visit http://localhost:3000/
- Select 'Register'
- Fill out the form (Name, Email, Password)
- You're now logged in as a standard user.

6. **Manually Elevating to Admin:**
After creating an account through the app, you can use the FireStore emulator to switch yourself to an administrator.
- Visit http://localhost:4000/ (4000 is the default port)
- Select 'FireStore' from the top menu bar
- Select the 'loginCredentials' collection.
- Find your entry, and select the pencil next to the `isAdmin` field.
- Flip the bool to `true`