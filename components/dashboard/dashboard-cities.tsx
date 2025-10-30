"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/features/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, X, Star, GripVertical, Search } from "lucide-react";
import { toast } from "sonner";
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
import Link from "next/link";
import { toSlug } from "@/utils/getLocations";

interface Location {
  id: number;
  city?: string;
  state: string;
  stateCode: string;
  isDefault?: boolean;
}

interface DashboardCitiesProps {
  userId?: string;
  initialLocations: Location[];
  allLocations: Location[];
}

function SortableLocationCard({
  location,
  onRemove,
  onSetDefault,
}: {
  location: Location;
  onRemove: (id: number) => void;
  onSetDefault: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: location.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="group">
        <CardContent className="flex items-center gap-4 p-3">
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>

          <Link
            href={`/events/${toSlug(location.city || location.state)}`}
            className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <MapPin className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-normal mt-10 text-lg text-blue md:inline-block font-semibold pt-0">
                  {location.city || location.state}
                </h3>
                {location.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{location.state}</p>
            </div>
          </Link>

          <div className="flex gap-2">
            {!location.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSetDefault(location.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Star className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(location.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardCities({
  userId,
  initialLocations,
  allLocations,
}: DashboardCitiesProps) {
  const { supabase } = useAppContext();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Search locations
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = allLocations
      .filter((loc) => {
        const cityMatch = loc.city
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const stateMatch = loc.state
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const isAlreadyAdded = locations.some(
          (userLoc) => userLoc.id === loc.id
        );
        return (cityMatch || stateMatch) && !isAlreadyAdded;
      })
      .slice(0, 10);

    setSearchResults(results);
  }, [searchTerm, allLocations, locations]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = locations.findIndex((loc) => loc.id === active.id);
      const newIndex = locations.findIndex((loc) => loc.id === over.id);

      const newLocations = arrayMove(locations, oldIndex, newIndex);
      setLocations(newLocations);

      // Save new order to database
      await saveLocationOrder(newLocations);
    }
  };

  const saveLocationOrder = async (newLocations: Location[]) => {
    if (!userId) return;

    try {
      const defaultLocation = newLocations.find((loc) => loc.isDefault);
      const otherLocations = newLocations
        .filter((loc) => !loc.isDefault)
        .map((loc) => loc.id);

      await supabase
        .from("profiles")
        .update({
          default_location_id: defaultLocation?.id || null,
          other_locations: otherLocations,
        })
        .eq("id", userId);

      toast.success("City order saved");
    } catch (error) {
      console.error("Error saving location order:", error);
      toast.error("Failed to save city order");
    }
  };

  const handleAddLocation = async (location: Location) => {
    if (!userId) return;

    try {
      const isFirstLocation = locations.length === 0;
      const newLocation = { ...location, isDefault: isFirstLocation };
      const newLocations = [...locations, newLocation];
      setLocations(newLocations);

      if (isFirstLocation) {
        await supabase
          .from("profiles")
          .update({ default_location_id: location.id })
          .eq("id", userId);
      } else {
        const otherLocations = newLocations
          .filter((loc) => !loc.isDefault)
          .map((loc) => loc.id);

        await supabase
          .from("profiles")
          .update({ other_locations: otherLocations })
          .eq("id", userId);
      }

      setSearchTerm("");
      setShowSearch(false);
      toast.success(`Added ${location.city || location.state}`);
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error("Failed to add city");
    }
  };

  const handleRemoveLocation = async (locationId: number) => {
    if (!userId) return;

    try {
      const locationToRemove = locations.find((loc) => loc.id === locationId);
      const newLocations = locations.filter((loc) => loc.id !== locationId);

      if (locationToRemove?.isDefault && newLocations.length > 0) {
        // Set first remaining location as default
        newLocations[0].isDefault = true;
        await supabase
          .from("profiles")
          .update({
            default_location_id: newLocations[0].id,
            other_locations: newLocations.slice(1).map((loc) => loc.id),
          })
          .eq("id", userId);
      } else if (locationToRemove?.isDefault) {
        // No locations left
        await supabase
          .from("profiles")
          .update({ default_location_id: null, other_locations: [] })
          .eq("id", userId);
      } else {
        // Remove from other_locations
        const otherLocations = newLocations
          .filter((loc) => !loc.isDefault)
          .map((loc) => loc.id);

        await supabase
          .from("profiles")
          .update({ other_locations: otherLocations })
          .eq("id", userId);
      }

      setLocations(newLocations);
      toast.success("City removed");
    } catch (error) {
      console.error("Error removing location:", error);
      toast.error("Failed to remove city");
    }
  };

  const handleSetDefault = async (locationId: number) => {
    if (!userId) return;

    try {
      const newLocations = locations.map((loc) => ({
        ...loc,
        isDefault: loc.id === locationId,
      }));

      setLocations(newLocations);

      const otherLocations = newLocations
        .filter((loc) => !loc.isDefault)
        .map((loc) => loc.id);

      await supabase
        .from("profiles")
        .update({
          default_location_id: locationId,
          other_locations: otherLocations,
        })
        .eq("id", userId);

      toast.success("Default city updated");
    } catch (error) {
      console.error("Error setting default:", error);
      toast.error("Failed to set default city");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px] text-3xl font-bold tracking-tight">
            My Cities
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your locations and track events in your favorite cities
          </p>
        </div>
        <Button onClick={() => setShowSearch(!showSearch)}>
          <Plus className="h-4 w-4 mr-2" />
          Add City
        </Button>
      </div>

      {/* Search Section */}
      {showSearch && (
        <Card>
          <CardHeader>
            <CardTitle>Add a City</CardTitle>
            <CardDescription>
              Search for cities to add to your list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search cities or states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent cursor-pointer"
                    onClick={() => handleAddLocation(location)}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {location.city || location.state}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {location.state}
                        </p>
                      </div>
                    </div>
                    <Plus className="h-5 w-5" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cities List */}
      {locations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-normal mt-10 text-lg text-blue md:inline-block font-semibold text-lg mb-2 pt-0">
              No cities added yet
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Add cities to track events in your favorite locations
            </p>
            <Button onClick={() => setShowSearch(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First City
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Drag and drop to reorder your cities. Your preferred order will be
            saved.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={locations.map((loc) => loc.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {locations.map((location) => (
                  <SortableLocationCard
                    key={location.id}
                    location={location}
                    onRemove={handleRemoveLocation}
                    onSetDefault={handleSetDefault}
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
