import { auth } from "@clerk/nextjs/server";
import ProfileClient from "./profile-client";

const ProfilePage = async () => {
  const { userId } = await auth();
  const data = await fetch("http://localhost:3000/api/fetch-profile", {
    method: "POST",
    body: JSON.stringify({ clerkId: userId }),
    next: {
      tags: ["profile"],
    },
  });

  const user = await data.json();

  return <ProfileClient user={user.user} />;
};

export default ProfilePage;
