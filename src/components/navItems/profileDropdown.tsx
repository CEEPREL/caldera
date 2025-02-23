import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";

export function ProfileDropdown({
  handleSignOut,
}: {
  handleSignOut: () => Promise<void>;
}) {
  return (
    <Menubar className="w-32 rounded-full">
      <MenubarMenu>
        <MenubarTrigger className="w-32 rounded-full">
          Ayodele{" "}
          <div className=" cursor-pointer">
            <Image
              //   className=" top-1 left-1"
              width={15}
              height={15}
              alt=""
              src={"/icons/filled_dropdown.svg"}
            />
          </div>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSeparator />
          <MenubarItem className="hover:bg-gray-100" inset>
            Profile
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            className="bg-red-300 hover:bg-red-400"
            onClick={handleSignOut}
            inset
          >
            Sign out
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
