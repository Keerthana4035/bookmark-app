"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabaseClient";

type Bookmark = {
  id: number;
  url: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .order("id", { ascending: false });

      if (data) setBookmarks(data);
    };

    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        fetchBookmarks
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addBookmark = async () => {
    const supabase = getSupabase();
    if (!supabase || !url) return;

    await supabase.from("bookmarks").insert([{ url }]);
    setUrl("");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Smart Bookmark App 🔖</h1>

      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-80"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={addBookmark}
        >
          Add
        </button>
      </div>

      <ul className="mt-6 space-y-2">
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {bookmark.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}