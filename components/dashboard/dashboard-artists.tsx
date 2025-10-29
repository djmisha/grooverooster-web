"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/features/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Search, Star, Plus, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import artistsData from "@/localArtistsDB.json";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Artist {
  id: string;
  name: string;
  arrayIndex?: number;
}

interface DashboardArtistsProps {
  userId?: string;
  initialFavoriteIds: number[];
}

function SortableArtistCard({
  artist,
  onRemove,
}: {
  artist: Artist;
  onRemove: (arrayIndex: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: artist.arrayIndex! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="group">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                {...listeners}
                className="cursor-grab active:cursor-grabbing touch-none"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base truncate pt-0">
                  {artist.name}
                </CardTitle>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">
                    Favorite
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(artist.arrayIndex!)}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function DashboardArtists({
  userId,
  initialFavoriteIds,
}: DashboardArtistsProps) {
  const { supabase } = useAppContext();
  const [favoriteIds, setFavoriteIds] = useState<number[]>(initialFavoriteIds);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get favorite artists - maintain order from favoriteIds
  const favoriteArtists = useMemo(() => {
    return favoriteIds
      .map((index) => {
        const artist = artistsData[index];
        if (!artist) return null;
        return {
          ...artist,
          id: String(artist.id),
          arrayIndex: index,
        };
      })
      .filter(Boolean) as Artist[];
  }, [favoriteIds]);

  // Search results
  const searchResults = useMemo(() => {
    if (searchTerm.trim() === "") return [];

    return artistsData
      .map((artist, index) => ({ artist, index }))
      .filter(
        ({ artist, index }) =>
          artist.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !favoriteIds.includes(index)
      )
      .slice(0, 20)
      .map(({ artist, index }) => ({
        ...artist,
        id: String(artist.id),
        arrayIndex: index,
      }));
  }, [searchTerm, favoriteIds]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = favoriteIds.indexOf(Number(active.id));
      const newIndex = favoriteIds.indexOf(Number(over.id));

      const newOrder = arrayMove(favoriteIds, oldIndex, newIndex);
      setFavoriteIds(newOrder);

      // Save to database
      if (userId) {
        try {
          await supabase
            .from("profiles")
            .update({ favorite_artists: newOrder })
            .eq("id", userId);
          toast.success("Artist order saved");
        } catch (error) {
          console.error("Error saving order:", error);
          toast.error("Failed to save order");
          setFavoriteIds(favoriteIds); // Revert on error
        }
      }
    }
  };

  const handleAddFavorite = async (artistIndex: number) => {
    if (!userId) return;

    try {
      const updatedFavorites = [...favoriteIds, artistIndex];
      setFavoriteIds(updatedFavorites);

      await supabase
        .from("profiles")
        .update({ favorite_artists: updatedFavorites })
        .eq("id", userId);

      const artist = artistsData[artistIndex];
      toast.success(`Added ${artist.name} to favorites`);
      setSearchTerm("");
    } catch (error) {
      console.error("Error adding favorite:", error);
      toast.error("Failed to add artist");
      setFavoriteIds(favoriteIds);
    }
  };

  const handleRemoveFavorite = async (artistIndex: number) => {
    if (!userId) return;

    try {
      const updatedFavorites = favoriteIds.filter((id) => id !== artistIndex);
      setFavoriteIds(updatedFavorites);

      await supabase
        .from("profiles")
        .update({ favorite_artists: updatedFavorites })
        .eq("id", userId);

      const artist = artistsData[artistIndex];
      toast.success(`Removed ${artist.name} from favorites`);
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove artist");
      setFavoriteIds(favoriteIds);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Artists</h1>
          <p className="text-muted-foreground mt-2">
            Track your favorite DJs and artists, never miss a show
          </p>
        </div>
        <Button onClick={() => setShowSearch(!showSearch)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Artist
        </Button>
      </div>

      {/* Search Section */}
      {showSearch && (
        <Card>
          <CardHeader>
            <CardTitle>Add an Artist</CardTitle>
            <CardDescription>
              Search for artists to add to your favorites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {searchResults.map((artist) => (
                  <div
                    key={artist.arrayIndex}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent cursor-pointer"
                    onClick={() => handleAddFavorite(artist.arrayIndex!)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <Music className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{artist.name}</p>
                      </div>
                    </div>
                    <Plus className="h-5 w-5 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Artists List */}
      {favoriteArtists.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2 pt-0">
              No artists added yet
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Add artists to track their shows and never miss a performance
            </p>
            <Button onClick={() => setShowSearch(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Artist
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {favoriteArtists.length}{" "}
            {favoriteArtists.length === 1 ? "artist" : "artists"} in your
            favorites. Drag to reorder.
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={favoriteIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {favoriteArtists.map((artist) => (
                  <SortableArtistCard
                    key={artist.arrayIndex}
                    artist={artist}
                    onRemove={handleRemoveFavorite}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
