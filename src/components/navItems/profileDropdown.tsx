import { useStore } from "@/ContextAPI/storeContex";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { capitalizeFirstLetter } from "../admin/AdminOrderDetailSlider";
import { useRouter } from "next/navigation"; // Import useRouter

export function ProfileDropdown({
  handleSignOut,
}: {
  handleSignOut: () => Promise<void>;
}) {
  const { storeData } = useStore();
  const router = useRouter(); // Initialize useRouter

  // Function to handle profile redirect
  const handleProfileRedirect = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    router.push(`${baseUrl}/caldera/${storeData?.data.storeId}/settings`);
  };

  return (
    <Menubar className="w-32 rounded-full">
      <MenubarMenu>
        <MenubarTrigger className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] xl:max-w-[350px] truncate flex items-center gap-2">
          <span className="overflow-hidden whitespace-nowrap text-ellipsis">
            {capitalizeFirstLetter(storeData?.data.fullName || "")}
          </span>
          <div className="cursor-pointer">
            <Image
              width={15}
              height={15}
              alt="Dropdown icon"
              src={"/icons/filled_dropdown.svg"}
            />
          </div>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSeparator />
          {/* Use the handleProfileRedirect function on click */}
          <MenubarItem
            className="hover:bg-gray-100"
            inset
            onClick={() => console.log("hello ", storeData)}
          >
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
