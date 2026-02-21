'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [url, setUrl] = useState('');
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Fetch all bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.log('Fetch error:', error);
    } else {
      setBookmarks(data || []);
    }
  };

  // Add bookmark
  const addBookmark = async () => {
    if (!url) {
      alert('Please enter URL');
      return;
    }

    const { error } = await supabase
      .from('bookmarks')
      .insert([{ url }]);

    if (error) {
      console.log('Insert error:', error);
    } else {
      setUrl('');
    }
  };

  // Delete bookmark
  const deleteBookmark = async (id: number) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Delete error:', error);
    }
  };

  // Realtime subscription
  useEffect(() => {
    fetchBookmarks();

    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">
        Smart Bookmark App 🚀
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      <ul className="w-full max-w-md">
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {bookmark.url}
            </a>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
