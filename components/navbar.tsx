import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed w-full p-8 flex justify-between items-start">
      <div className="nav-logo">
        <Link
          href="#"
          className="uppercase font-instrument-serif text-[0.9rem] leading-tight text-black"
        >
          Arsh Ali
        </Link>
      </div>
      <div className="nav-items flex column items-end">
        <Link
          href="#"
          className="uppercase font-instrument-serif text-[0.9rem] leading-tight text-black"
        >
          About
        </Link>
        <Link
          href="#"
          className="uppercase font-instrument-serif text-[0.9rem] leading-tight text-black"
        >
          Projects
        </Link>
        <Link
          href="#"
          className="uppercase font-instrument-serif text-[0.9rem] leading-tight text-black"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
