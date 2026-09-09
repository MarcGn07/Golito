import Link from "next/link";
import { logIn } from "@/app/auth/actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link href="/" className="mb-8 font-display text-xl font-semibold">
        Golito
      </Link>
      <h1 className="font-display text-3xl font-semibold">Log in</h1>
      <p className="mt-2 text-muted-light dark:text-muted-dark">
        Your saved scores are waiting.
      </p>

      {searchParams.error && (
        <p className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {searchParams.error}
        </p>
      )}

      <form action={logIn} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="redirect" value={searchParams.redirect ?? "/"} />
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required className="input-field" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="btn-primary mt-2">
          Log in
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-light dark:text-muted-dark">
        New to Golito?{" "}
        <Link href="/signup" className="font-medium text-ink dark:text-paper underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
