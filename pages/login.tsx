import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <>
      <h1>Sign in</h1>
      <Link
        className="col-span-5 col-start-2 uppercase row-start-9 text-xs text-gray2 tracking-widest "
        href="/api/auth/apple/login"
      >
        Sign in with Apple
      </Link>
    </>
  );
}
