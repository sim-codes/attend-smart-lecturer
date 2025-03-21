import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1>This is homepage</h1>
      <Link href={"/login"}>
      Please login
      </Link>
    </div>
  );
}
