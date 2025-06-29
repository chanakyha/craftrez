import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = process.env.SIGNING_SECRET;
  if (!secret) return new Response("Missing secret", { status: 500 });

  const wh = new Webhook(secret);
  const body = await req.text();
  const headerPayload = await headers();

  const event = wh.verify(body, {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  }) as WebhookEvent;

  if (event.type === "user.created" || event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, username, image_url } =
      event.data;
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: email_addresses.map((email) => {
          return {
            email: email.email_address,
            oauth: email.linked_to[0]?.type,
          };
        }),
        FullName: `${first_name} ${last_name}`,
        username: username,
        avatar: image_url,
      },
      create: {
        clerkId: id,
        email: email_addresses.map((email) => {
          return {
            email: email.email_address,
            oauth: email.linked_to[0]?.type,
          };
        }),
        FullName: `${first_name} ${last_name}`,
        username: username,
        avatar: image_url,
        credits: 10,
      },
    });
  } else if (event.type === "user.deleted") {
    const { id } = event.data;
    const user = await prisma.user.findUnique({
      where: { clerkId: id },
    });
    if (user) {
      try {
        await prisma.user.delete({
          where: { clerkId: id },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  return new Response("OK");
}
