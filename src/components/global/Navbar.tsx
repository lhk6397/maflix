import React, {
  HTMLInputTypeAttribute,
  useCallback,
  useEffect,
  useState,
} from "react";
import { BsChevronDown, BsSearch, BsBell } from "react-icons/bs";
import { motion } from "framer-motion";

import MobileMenu from "@/components/global/MoblieMenu";
import NavbarItem from "@/components/global/NavbarItem";
import AccountMenu from "@/components/global/AccountMenu";
import menuList from "@/data/menuList";
import { useRouter } from "next/router";

const TOP_OFFSET = 66;

const Navbar = () => {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= TOP_OFFSET) {
        setShowBackground(true);
      } else {
        setShowBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((current) => !current);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((current) => !current);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?query=${searchQuery}&page=1`);
  };

  return (
    <nav className="w-full fixed z-40">
      <div
        className={`px-4 md:px-16 py-6 flex flex-row items-center transition duration-500 ${
          showBackground ? "bg-primary-black-900" : ""
        }`}
      >
        <img
          src="/images/logo.png"
          className="h-4 lg:h-7 cursor-pointer"
          onClick={() => router.push("/")}
          alt="Logo"
        />
        <div className="flex-row ml-8 gap-7 hidden lg:flex">
          {menuList.map((menu, idx) => (
            <NavbarItem
              label={menu.title}
              key={idx}
              active={menu.link === router.pathname}
              route={menu.link}
            />
          ))}
        </div>
        <div
          onClick={toggleMobileMenu}
          className="lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative"
        >
          <p className="text-white text-sm">Browse</p>
          <BsChevronDown
            className={`w-4 text-white fill-white transition ${
              showMobileMenu ? "rotate-180" : "rotate-0"
            }`}
          />
          <MobileMenu visible={showMobileMenu} />
        </div>

        <div className="flex flex-row ml-auto gap-7 items-center">
          <motion.div className="text-gray-200 hover:text-gray-300 cursor-pointer transition relative">
            <BsSearch
              className={`
                w-6
                ${
                  isSearching
                    ? "absolute top-1/2 bottom-1/2 -translate-y-1/2 left-1"
                    : "block"
                }
              `}
              onClick={() => setIsSearching((prev) => !prev)}
            />
            {isSearching && (
              <motion.form onSubmit={onSubmit}>
                <motion.input
                  placeholder="제목, 사람, 장르"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.currentTarget.value)
                  }
                  autoFocus
                  className="bg-primary-black-900 text-primary-white-300 w-[15vw] placeholder:text-primary-white-600 py-2 text-sm pl-8 pr-4"
                />
              </motion.form>
            )}
          </motion.div>
          <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
            <BsBell className="w-6" />
          </div>
          <div
            onClick={toggleAccountMenu}
            className="flex flex-row items-center gap-2 cursor-pointer relative"
          >
            <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
              <img src="/images/default-blue.png" alt="" />
            </div>
            <BsChevronDown
              className={`w-4 text-white fill-white transition ${
                showAccountMenu ? "rotate-180" : "rotate-0"
              }`}
            />
            <AccountMenu visible={showAccountMenu} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
