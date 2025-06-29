import { currentUser } from "@clerk/nextjs/server";
import TransactionsClient from "./transactions-client";

const TransactionsPage = async () => {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  let sessions: Session[] = [];

  if (email) {
    try {
      const sessionsData = await fetch(
        "http://localhost:3000/api/all-sessions",
        {
          method: "POST",
          body: JSON.stringify({ email, clerkId: user?.id }),
          next: {
            tags: ["transactions"],
          },
          cache: "no-store",
        }
      );

      const data = await sessionsData.json();

      sessions = (data.sessions.data as Session[]) || [];

      console.log(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }

  return <TransactionsClient initialSessions={sessions} />;
};

export default TransactionsPage;
