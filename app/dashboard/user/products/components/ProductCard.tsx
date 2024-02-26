import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Product } from "@/lib/types";

const ProductCard = ({id, name, image, price, description}: Product) => (
  <div className="my-2 flex flex-gird ">
    <Link href={`/dashboard/user/products/${id}`}>
      <Card className="w-[250px] m-4">
        <CardHeader>
          <Image 
            src={image ?? ""}
            alt={name}
            width={250}
            height={250}
          />
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          {description}
        </CardContent>
        <CardFooter>
          {price?.toLocaleString("en-US",
            {
              style: "currency", 
              currency: "USD"
            }
          )}
          </CardFooter>
      </Card>
    </Link>
  </div>
);

export default ProductCard;




 // <div className="p-2 flex flex-col">
  //   <Image
  //     className={`aspect-[2/2] rounded-md object-cover`}
  //     src={image ?? ""}
  //     alt={`${name} image`}
  //     width={1024}
  //     height={1024}
  //   />
  //   <div>
  //     {name && (
  //       <h3
  //         className={`mt-2 font-bold leading-10 text-gray-100 ${
  //           small ? "" : "text-xl"
  //         }`}
  //       >
  //         {name}
  //       </h3>
  //     )}
  //     {!small && price && (
  //       <div className="my-1 text-md leading-5 text-gray-300">
  //         {price.toLocaleString("en-US", {
  //           style: "currency",
  //           currency: "USD",
  //         })}
  //       </div>
  //     )}
  //     {!small && description && (
  //       <div className="mt-1 text-sm leading-5 text-gray-300 font-light italic">
  //         {description}
  //       </div>
  //     )}
  //   </div>
  // </div>