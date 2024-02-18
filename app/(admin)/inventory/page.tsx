import { Product } from "@/lib/types"
import { columns } from "./columns"
import { DataTable } from "./table"

async function getData(): Promise<Product[]> {
  // Fetch data from your API here.
  const response = await fetch('http://localhost:3000/api/product', {
    method: "GET",
    headers: {
        "content-type": "application/json"
    },
    cache: "force-cache"
  })
  .then(res => res.json())
  const products: Product[] = await response
  return products
}

export default async function InventoryPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
