Job Tracker

Job Tracker is a web application that helps users track job applications, monitor progress, and analyze their job search with statistics and insights.
Features
- User authentication (Sign up, Login, Logout)
- Add, edit, and delete job applications
- Track job statuses (Applied, Interview, Offer, Rejected) - Sort and search job applications easily
- View job application statistics with interactive charts
- Profile management (Edit name, bio, LinkedIn profile) - Dark mode toggle for better user experience
- Resume and cover letter file upload support
- Real-time updates using Firebase

Tech Stack
- **Next.js** - Framework for building fast web applications
- **TypeScript** - Strongly-typed JavaScript for better development experience - **Firebase** - Authentication, Firestore database, and Storage for file uploads - **Chart.js** - For visualizing job application data with interactive charts
- **Tailwind CSS** - For responsive and modern styling

Getting Started
1. Clone the repository
To get started, clone the repository to your local machine:
git clone https://github.com/Terminator567/job-tracker.git cd job-tracker
2. Install dependencies
Run the following command to install the required dependencies:
npm install
3. Set up Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication**, **Firestore Database**, and **Storage**.
3. Get your Firebase configuration from **Project Settings > General**.
4. Create a `.env.local` file in the project root directory and add the following environment variables:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
4. Run the development server
Start the development server:
npm run dev
The application will be available at:
http://localhost:3000

Follow the setup prompts to configure your project.
Deploying to Firebase Hosting
1. Install Firebase CLI:
npm install -g firebase-tools
2. Login to Firebase:
firebase login
3. Initialize Firebase Hosting:
firebase init
- Select **Hosting** and choose your Firebase project. - Set the public directory to `.next`.
- Configure as a single-page app (yes).
- Do not overwrite `index.html`.
4. Deploy:
firebase deploy
Your app will be live at:
https://job-tracker.firebaseapp.com/
Future Features

- **Email reminders for interviews** - Get notified before scheduled interviews
- **Job deadline calendar** - View deadlines in a calendar format
- **Job alerts for open positions** - Get notifications for relevant job postings
- **More statistics & insights** - Advanced charts and reports for better analysis

Contributing
Contributions are welcome! If you'd like to contribute:
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit your changes (`git commit -m "Added a new feature"`) 
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request
