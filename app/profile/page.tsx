import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserFavorites } from "@/lib/db/queries";
import Link from "next/link";
import { Header } from "@/components/header";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const favorites = await getUserFavorites(session.user.id!);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {session.user.name?.[0] || session.user.email?.[0] || "?"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user.name || "Anonymous User"}
              </h1>
              <p className="text-gray-600">{session.user.email}</p>
              {session.user.id && (
                <p className="text-sm text-gray-400 mt-1">
                  ID: {session.user.id.slice(0, 8)}...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Favorites */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              My Favorites ({favorites.length})
            </h2>
            <Link
              href="/tools"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Browse more tools →
            </Link>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No favorites yet</p>
              <p className="text-sm">
                Start exploring tools and save your favorites here!
              </p>
              <Link
                href="/tools"
                className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Explore Tools
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {favorites.map((fav) => (
                <Link
                  key={fav.id}
                  href={`/tools/${fav.tool.slug}`}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition"
                >
                  {fav.tool.logoUrl ? (
                    <img
                      src={fav.tool.logoUrl}
                      alt={fav.tool.name}
                      className="w-12 h-12 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                      🔧
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {fav.tool.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {fav.tool.description}
                    </p>
                  </div>
                  <span className="text-2xl">{fav.tool.category?.icon || "📁"}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link
            href="/submit"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <span className="text-3xl mb-2 block">📮</span>
            <h3 className="font-semibold text-gray-900">Submit a Tool</h3>
            <p className="text-sm text-gray-500 mt-1">
              Share an AI tool with the community
            </p>
          </Link>
          <Link
            href="/blog"
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition text-center"
          >
            <span className="text-3xl mb-2 block">📝</span>
            <h3 className="font-semibold text-gray-900">Blog Posts</h3>
            <p className="text-sm text-gray-500 mt-1">
              Read latest AI tools news and tips
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}