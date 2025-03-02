import { redirect } from "next/navigation";

export default function Home() {
  redirect("/jobs"); // ✅ Redirects users to /jobs when they visit "/"
  return null;
}
