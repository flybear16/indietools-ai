"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  toolId: string;
  initialIsFavorite?: boolean;
  showText?: boolean;
}

export function FavoriteButton({
  toolId,
  initialIsFavorite = false,
  showText = false,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        await fetch(`/api/favorites?toolId=${toolId}`, { method: "DELETE" });
        setIsFavorited(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolId }),
        });
        setIsFavorited(true);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        isFavorited
          ? "text-red-500 hover:text-red-600"
          : "text-gray-500 hover:text-gray-600"
      } ${loading ? "opacity-50" : ""}`}
    >
      <Heart
        className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isFavorited ? "Favorited" : "Add to Favorites"}
        </span>
      )}
    </button>
  );
}