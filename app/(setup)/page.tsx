import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();

  if (profile instanceof NextResponse) {
    return profile; 
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    console.log("No server found for this profile");
  }

  if(server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialModal />
}

export default SetupPage;
