import { getAccount } from "@/lib/library";
import { isAnonymousUser } from "@/lib/auth/guest";
import SiteNavigation from "./SiteNavigation";

export default async function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAccount();
  const name = user?.user_metadata?.username;
  const isGuest = isAnonymousUser(user);
  return (
    <SiteNavigation
      username={
        typeof name === "string" ? name : (user?.email?.split("@")[0] ?? null)
      }
      signedIn={!!user}
      isGuest={isGuest}
    >
      {children}
    </SiteNavigation>
  );
}
