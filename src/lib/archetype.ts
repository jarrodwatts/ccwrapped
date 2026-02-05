import type { Archetype } from "@/lib/types";
import { ARCHETYPE_DEFINITIONS } from "@/config/archetypes";
import type { ArchetypeDefinition } from "@/config/archetypes";

export function getArchetypeDefinition(
  archetype: Archetype
): ArchetypeDefinition {
  return ARCHETYPE_DEFINITIONS[archetype];
}
