"use client";

import { useEffect, useRef, useState } from "react";
import { searchPlayers, type PlayerSearchResult } from "@/app/admin/_actions/players";
import { Flag } from "@/components/flag";
import {
  UEFA_FLAGS,
  CONMEBOL_FLAGS,
  CONCACAF_FLAGS,
  CAF_FLAGS,
  AFC_FLAGS,
  OFC_FLAGS,
} from "@/lib/flags";

const FLAG_GROUPS = [
  { label: "UEFA", options: UEFA_FLAGS },
  { label: "CONMEBOL", options: CONMEBOL_FLAGS },
  { label: "CONCACAF", options: CONCACAF_FLAGS },
  { label: "CAF", options: CAF_FLAGS },
  { label: "AFC", options: AFC_FLAGS },
  { label: "OFC", options: OFC_FLAGS.filter((f) => f.code !== "tg2") },
];

export function PlayerAnswerRow({
  answerFieldName,
  flagFieldName,
  initialAnswer = "",
  initialFlagCode = null,
}: {
  answerFieldName: string;
  flagFieldName: string;
  initialAnswer?: string;
  initialFlagCode?: string | null;
}) {
  const [query, setQuery] = useState(initialAnswer);
  const [flagCode, setFlagCode] = useState<string | null>(initialFlagCode);
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const matches = await searchPlayers(query);
      setResults(matches);
      setIsOpen(matches.length > 0);
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function selectPlayer(player: PlayerSearchResult) {
    setQuery(player.name);
    setFlagCode(player.flagCode);
    setResults([]);
    setIsOpen(false);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          name={answerFieldName}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Search a player, or type any name…"
          autoComplete="off"
          className="input-field"
        />
        {isOpen && (
          <ul className="surface absolute z-10 mt-1 w-full overflow-hidden rounded-2xl shadow-lg">
            {results.map((player) => (
              <li key={player.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // keep focus so onBlur doesn't fire first
                  onClick={() => selectPlayer(player)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-paper-2 dark:hover:bg-ink-2"
                >
                  {player.flagCode && <Flag code={player.flagCode} />}
                  <span>{player.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <select
        name={flagFieldName}
        value={flagCode ?? ""}
        onChange={(e) => setFlagCode(e.target.value || null)}
        className="input-field w-40 shrink-0"
      >
        <option value="">No flag</option>
        {FLAG_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((f) => (
              <option key={f.code} value={f.code}>
                {f.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
