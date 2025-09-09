import Link from "next/link";

export default function HomeButton() {
  return (
    <Link
      href="/"
      className="block w-full text-center bg-amber-600 text-white p-2 rounded hover:bg-amber-700 cursor-pointer mt-4"
    >
      Home
    </Link>
  );
}
