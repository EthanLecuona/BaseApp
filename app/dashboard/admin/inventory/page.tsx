import { Inventory, Product } from "@/lib/types"
import { InventoryTable } from "./components/InventoryTable"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"


async function getInventory(): Promise<Inventory[]> {
  // Fetch data from your API here.
  const response = await fetch('http://localhost:3000/api/inventory', {
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
    cache: "no-cache"
  })
  .then(res => res.json())
  const inventory: Inventory[] = await response
  return inventory
}

// async function addInventory()


export default async function InventoryPage() {
  const data = await getInventory()
  const session = await getServerSession(authOptions)
  if(!session || session.user.role !== 'admin') {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto py-10">

      <InventoryTable data={data} />
    </div>
  )
}
