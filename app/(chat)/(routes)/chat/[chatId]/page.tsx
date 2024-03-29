import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChatClient } from "./components/client";

// sabse pehle character ko load krna hai jiska id url me show ho rha hai
interface ChatIdPageProps {
    // here we use only params not searchparams kyoki yhn sirf dynaamic id hai, searchParams is used when they is query in  url like  1dc-8a64-2272273cf9a9?name= something that is stored in searchparams
    
  params: {
    chatId: string;
  };
}
const ChatIdPage = async ({
    params
}: ChatIdPageProps) => {
    const { userId } = auth();
    if (!userId) {
        return redirectToSignIn();
    }
    const companion = await prismadb.companion.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                where: {
                    userId,
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    if (!companion) {
        return redirect("/");
    }
    return (
        <ChatClient companion={companion} />
    );
}
 
export default ChatIdPage;