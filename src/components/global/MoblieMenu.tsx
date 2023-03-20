import menuList from "@/data/menuList";
import React from "react";

interface MobileMenuProps {
  visible?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="bg-black w-56 absolute top-8 left-0 py-5 flex-col border-2 border-gray-800 flex">
      <div className="flex flex-col gap-4">
        {menuList.map((menu, idx) => (
          <div
            key={idx}
            className="px-3 text-center text-white hover:underline"
          >
            {menu}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
