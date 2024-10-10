import { NextResponse } from "next/server";
import { Message } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

const MESSAGES_BATCH = 10;

export async function GET(req: Request, res: { setHeader: (arg0: string, arg1: string) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) {
  
  res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'max-age=31536000, public');
  
    res.status(200).json({ message: 'Headers set' });

  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!channelId)
      return new NextResponse("Channel ID Missing", { status: 400 });

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          channelId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: { createdAt: "asc" }
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: { channelId },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: { createdAt: "asc" }
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}