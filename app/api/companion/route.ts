import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        // check wheter we are loggedin or not.. ye apan check krenge by saying ki we are able to load the user or not
        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized, line 14 route.ts companion", { status: 401 }); 
        }
        if (!src || !name || !description || !instructions || !seed || !categoryId) {
          return new NextResponse("Missing required field", { status: 400 });
        }

      // TODO : check for subscription
      const isPro = await checkSubscription();
      if (!isPro) {
        return new NextResponse("Premium Subscription required", { status: 403 });
      }

        const companion = await prismadb.companion.create({
          data: {
            categoryId,
            userId: user.id,
            userName: user.firstName,
            src, 
            name,
            description,
            instructions,
            seed
          },
        });

        return NextResponse.json(companion);


    } catch (error) {
        console.log("[COMPANION_POST", error);
        return new NextResponse("Internal Error", { status: 500 });

    }
}