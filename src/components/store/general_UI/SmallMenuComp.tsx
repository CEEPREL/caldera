import Image from "next/image";

interface MenuItem {
  label: string;
  icon: string;
  actionType?: "link" | "button" | "div";
  href?: string;
}

interface MenuComponentProps {
  menuItems: MenuItem[];
  onMenuItemClick: (label: string, product: any) => void;
  product: any;
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  menuItems,
  onMenuItemClick,
  product,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {menuItems.map((item, index) => {
        if (item.actionType === "link" && item.href) {
          return (
            <div
              key={index}
              // href={item.href || "#"}
              className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border hover:border-gray-500 transition cursor-pointer"
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          );
        } else if (item.actionType === "button") {
          return (
            <button
              key={index}
              className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border hover:border-gray-500 transition cursor-pointer"
              onClick={() => onMenuItemClick(item.label, product)}
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span className="text-sm text-gray-700">{item.label}</span>
            </button>
          );
        } else {
          return (
            <div
              key={index}
              className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border hover:border-gray-500 transition cursor-pointer"
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
          );
        }
      })}
    </div>
  );
};

export default MenuComponent;
