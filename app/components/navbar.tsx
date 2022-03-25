import { useState } from "react";
import { NavLink, Link } from "remix";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <nav>
      <div className="bg-orange-300">
        <ResposiveNav menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      </div>
    </nav>
  );
}

const NavMenu = () => {
  const pages: string[] = ["Beranda", "Materi", "Bank Soal", "Tentang"];

  return pages.map((page) => (
    <NavLink
      key={`${page}`}
      className={({ isActive }: { isActive: any }) =>
        "no-underline text-gray-800 font-semibold " +
        (isActive ? "text-gray-100" : "hover:text-gray-700")
      }
      to={`/${
        page == "Beranda" ? "" : page.split(" ").join("-").toLowerCase()
      }`}
    >
      {page}
    </NavLink>
  ));
};

const ResposiveNav = ({
  menuOpened,
  setMenuOpened,
}: {
  menuOpened: boolean;
  setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="flex items-center justify-between p-4 md:px-16">
    <div className="flex items-center">
      <Link to="/" className="text-xl font-bold no-underline text-gray-800">
        Brainiest
      </Link>
    </div>

    <div className="hidden md:block space-x-7">{NavMenu()}</div>

    <button
      type="button"
      aria-label="toggle mobile menu"
      onClick={() => setMenuOpened(!menuOpened)}
      className="rounded flex justify-center items-center md:hidden focus:outline-none focus:ring focus:ring-gray-800"
    >
      <HamburgerIcon menuOpened={menuOpened} />
    </button>
  </div>
);

const HamburgerIcon = ({ menuOpened }: { menuOpened: boolean }) => (
  <FontAwesomeIcon icon={menuOpened ? faX : faBars} className="h-8 w-8" />
);
