import { createClient } from "@/lib/supabase/server";

export default async function DebugAdminPage() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const profileQuery = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : null;

  return (
    <pre className="mx-auto max-w-2xl overflow-auto p-6 text-xs">
      {JSON.stringify(
        {
          user: user ? { id: user.id, email: user.email } : null,
          userError,
          profile: profileQuery?.data ?? null,
          profileError: profileQuery?.error ?? null,
        },
        null,
        2
      )}
    </pre>
  );
}
