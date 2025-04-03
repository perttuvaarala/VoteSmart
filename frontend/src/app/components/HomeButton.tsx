"use client";
import { useRouter } from "next/navigation";

export default function HomeButton() {
  const router = useRouter();

  const handleBack = () => {
    router.push(`/`);
  };

  return (
    <button
      onClick={handleBack}
      className="w-full text-center bg-amber-600 text-white p-2 rounded hover:bg-amber-700 cursor-pointer mt-4"
    >
      Home
    </button>
  );
}
