import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params} : {params : {companionId : string}}
) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;
    
    if (!params.companionId) {
      return new NextResponse("CompanionId is required", { status: 400 });
    }
    // check wheter we are loggedin or not.. ye apan check krenge by saying ki we are able to load the user or not
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized , line 20 routes.ts[companionId]", { status: 401 });
    }
    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !seed ||
      !categoryId
    ) {
      return new NextResponse("Missing required field", { status: 400 });
    }

    // TODO : check for subscription
    const isPro = await checkSubscription();
    if (!isPro) {
      return new NextResponse("Premium Subscription required", { status: 403 });
    }

      const companion = await prismadb.companion.update({
          where : {
          id: params.companionId,
          userId : user.id, // this is protecting our id
          
        },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized ,line 72 [companion]", { status: 401 });
    }

    // yhn hmne ky kiya ki we only enabled the deletion of a character,jo ki currently logged in user ka hai aur jo id passed hai url me wo, isse koi aur user remove nhi kr payega companion ko

    const companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId,
      }
    });
    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 400 });
  }
}

