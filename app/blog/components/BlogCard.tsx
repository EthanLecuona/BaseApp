import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Image from "next/image";

interface Props {
    title: string;
    content: string;
    id: string;
    date: string;
    userId: string;
}

export default async function BlogCard({title, content, id, date, userId}: Props) {
    const author = await fetch(`http://localhost:3000/api/users?targetUserId=${userId}`).then((res) => res.json());
    return (
        <div className="my-2 flex flex-gird ">
            <Link href={`/blog/${id}`}>
                <Card className="w-[250px]">
                    <CardHeader >
                        <Image
                        src={author?.image || "/next.svg"}
                        alt={author?.name?? "Image"}
                        width={50}
                        height={50}
                        />
                        <CardTitle>
                            {title}
                        </CardTitle>
                        <CardDescription>
                            Author: {author?.name}
                        </CardDescription>
                    </CardHeader>


                    <CardContent className="grid gap-4">
                        {content}
                    </CardContent>

                    <CardFooter>
                        {new Date(date).toLocaleDateString()}
                    </CardFooter>
                </Card>
            </Link>
        </div>
    )
}