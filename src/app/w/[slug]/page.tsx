import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWrapped } from "@/lib/storage";
import { ARCHETYPE_DEFINITIONS } from "@/config/archetypes";
import { CardStack } from "@/components/card-stack";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stored = await getWrapped(slug);

  if (!stored) {
    return { title: "Not Found" };
  }

  const def = ARCHETYPE_DEFINITIONS[stored.payload.archetype];
  const { stats, streaks } = stored.payload;

  const title = `${def.name} — Claude Code Wrapped`;
  const description = `${stats.sessions.toLocaleString()} sessions · ${stats.messages.toLocaleString()} messages · ${streaks.longest}-day streak`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/api/og/${slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/${slug}`],
    },
  };
}

export default async function WrappedPage({ params }: PageProps) {
  const { slug } = await params;
  const stored = await getWrapped(slug);

  if (!stored) {
    notFound();
  }

  return <CardStack payload={stored.payload} slug={slug} />;
}
