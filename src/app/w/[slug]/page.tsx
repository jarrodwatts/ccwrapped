import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kv } from "@vercel/kv";
import type { StoredWrapped } from "@/lib/types";
import { ARCHETYPES } from "@/config/archetypes";
import { CardStack } from "@/components/card-stack";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getWrapped(slug: string): Promise<StoredWrapped | null> {
  const raw = await kv.get<string>(`wrapped:${slug}`);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stored = await getWrapped(slug);

  if (!stored) {
    return { title: "Not Found" };
  }

  const { payload } = stored;
  const archetype = ARCHETYPES[payload.archetype];

  const title = `${archetype.emoji} ${archetype.name} — Claude Code Wrapped`;
  const description = `${payload.stats.sessions.toLocaleString()} sessions · ${payload.stats.messages.toLocaleString()} messages · ${payload.highlights.longestStreak}-day streak`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/api/og/${slug}`],
      type: "website",
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
