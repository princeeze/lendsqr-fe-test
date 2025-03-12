import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the login page as there is no content to show

  redirect("/login");
  return <></>;
}
