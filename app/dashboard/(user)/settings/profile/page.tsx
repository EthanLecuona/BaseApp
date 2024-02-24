import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./profile-form"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function SettingsProfilePage() {
  const session = await getServerSession(authOptions);
  const user =  await fetch(`http://localhost:3000/api/users?targetUserEmail=${session?.user?.email}`,
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  })
  .then((res) => res.json())

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your profile settings.
        </p>
      </div>
      <Separator />
      <ProfileForm user={user} />
    </div>
  )
}
