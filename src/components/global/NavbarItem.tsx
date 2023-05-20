import { useRouter } from "next/router";
import React from "react";

interface NavbarItemProps {
  label: string;
  active?: boolean;
  route?: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ label, active, route }) => {
  const router = useRouter();

  const onClick = () => route && router.push(route);
  return (
    <div
      onClick={onClick}
      className={
        active
          ? "text-white cursor-default"
          : "text-gray-200 hover:text-gray-300 cursor-pointer transition"
      }
    >
      {label}
    </div>
  );
};

export default NavbarItem;
