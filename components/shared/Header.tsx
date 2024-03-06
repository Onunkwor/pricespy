import { navIcons } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="logo"
          />
          <p className="nav-logo">
            Pay<span className="text-primary">Spy</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          {navIcons.map((icons) => {
            return (
              <Image
                key={icons.alt}
                src={icons.src}
                alt={icons.alt}
                width={28}
                height={28}
              />
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Header;
