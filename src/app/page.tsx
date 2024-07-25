import Chat from "@/components/Chat";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    return redirect("/sign-in");
  } else {
    return (
      <>
        <Chat />
      </>
    );
  }
}
