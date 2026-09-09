import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-paper-3 dark:border-ink-3 bg-paper/80 dark:bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          Golito
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Link
              href="/account"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-lime text-ink font-display font-semibold"
            >
              {(user.user_metadata?.username ?? user.email ?? "?")
                .toString()
                .charAt(0)
                .toUpperCase()}
            </Link>
          ) : (
            <Link href="/login" className="btn-secondary text-sm py-2 px-5">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
