import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function ProfileDropdown() {
  return (
    <Menubar className="w-32 rounded-full">
      <MenubarMenu>
        <MenubarTrigger className="w-32 rounded-full">Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarSeparator />
          <MenubarItem inset>Profile</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Sign out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
