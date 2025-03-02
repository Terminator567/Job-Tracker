import "../styles/globals.css";
import AuthProvider from "./AuthProvider";

export const metadata = {
  title: "Job Tracker",
  description: "Track your job applications efficiently",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
