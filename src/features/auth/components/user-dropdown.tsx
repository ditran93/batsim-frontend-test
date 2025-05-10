import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "./user-profile";
import { useSignOut } from "../hooks/use-sign-out";
import { useConfirm } from "@/hooks/use-confirm";
import { LogOut } from "lucide-react";

export const UserDropdown = () => {
  const [logOutConfirm, LogOutDialog] = useConfirm();

  const { mutate: signOut } = useSignOut();

  const handleLogOut = async () => {
    const ok = await logOutConfirm();
    if (!ok) return;

    signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserProfile />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOut}>
            <LogOut className="size-4  mr-2" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogOutDialog
        title={"Log Out"}
        description={"Are you sure you want to log out?"}
        destructive
      />
    </>
  );
};
