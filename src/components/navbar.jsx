"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { url: "/", title: "Home" },
  { url: "/about", title: "About" },
  { url: "/portfolio", title: "Portfolio" },
  { url: "/contact", title: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:20px xl:48px ">
      <div className="hidden md:flex gap-4">
        {links.map((link) => (
          <Link href={link.url} key={link.title}>
            {link.title}
          </Link>
        ))}
      </div>

      {/* social Links  */}

      <div className="hidden  md:flex gap-4">
        <Link href="https://github.com/sharifulb07">
          <Image src="/github.png" alt="" width={24} height={24} />
        </Link>
        <Link href="https://dribbble.com/shariful0194418">
          <Image src="/dribbble.png" alt="" width={24} height={24} />
        </Link>
        <Link href="https://github.com/sharifulb07">
          <Image src="/facebook.png" alt="" width={24} height={24} />
        </Link>
        <Link href="https://github.com/sharifulb07">
          <Image src="/github.png" alt="" width={24} height={24} />
        </Link>
        <Link href="https://github.com/sharifulb07">
          <Image src="/instagram.png" alt="" width={24} height={24} />
        </Link>
        <Link href="https://www.linkedin.com/in/shariful-islam-663a02152/">
          <Image src="/linkedin.png" alt="" width={24} height={24} />
        </Link>
        <Link href="https://www.pinterest.com/sharifulb07/">
          <Image src="/pinterest.png" alt="" width={24} height={24} />
        </Link>
      </div>

      {/* LOGO */}
      <div className=" md:hidden ld:flex">
        <Link
          href="/"
          className="text-sm bg-black rounded-md p-1 font-semibold flex items-center justify-center"
        >
          <span className="text-white mr-1">sharif</span>
          <span className="w-12 h-8 bg-white text-black rounded flex items-center justify-center">
            .dev
          </span>
        </Link>
      </div>
      {/* RESPONSIVE MENU */}

      <div className="md:hidden ">
        <button
          className="w-10 h-8 flex flex-col justify-between z-50 relative"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="w-10 h-1 bg-white rounded"></div>
          <div className="w-10 h-1 bg-white rounded"></div>
          <div className="w-10 h-1 bg-white rounded"></div>
        </button>

        {/* MENU LIST  */}

        {open && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-black text-white text-4xl flex flex-col items-center justify-center gap-8 ">
            {links.map((link) => (
              <Link href={link.url} key={link.url}>
                {link.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
