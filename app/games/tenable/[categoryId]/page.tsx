import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { TenablePlay } from "./play";

export default async function TenablePlayPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const supabase = createClient();
  const { data: category } = await supabase
    .from("tenable_categories")
    .select("id, title, description, is_published, tenable_answers(id)")
    .eq("id", params.categoryId)
    .single();

  if (!category || !category.is_published) notFound();

  return (
    <>
      <Navbar />
      <TenablePlay
        categoryId={category.id}
        title={category.title}
        description={category.description}
        totalAnswers={category.tenable_answers?.length ?? 0}
      />
    </>
  );
}
