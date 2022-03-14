import { NavLink, Link } from "remix";

export default function Navbar() {
  const pages: string[] = ["Beranda", "Materi", "Bank Soal", "Tentang"];

  const navLinks = pages.map((page) => (
    <li key={`${page}`}>
      <NavLink to={`/${page == "Beranda" ? "" : page.toLowerCase()}`}>{page}</NavLink>
    </li>
  ));

  return (
    <nav>
      <div>
        <Link to="/">Brainiest</Link>
      </div>
      <ul>{navLinks}</ul>
    </nav>
  );
}