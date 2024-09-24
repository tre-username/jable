import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* User button is rendered first */}
      <UserButton afterSignOutUrl="/" />
      {/* ModeToggle will appear below the UserButton */}
      <ModeToggle />
    </div>
  );
}
