import { redirect } from "next/navigation";

interface PaginatedLocationProps {
  params: Promise<{ id: string; page: string }>;
}

export default async function PaginatedLocation({ params }: PaginatedLocationProps) {
  const { id, page } = await params;
  
  // Redirect to the main events page with page parameter
  redirect(`/events/${id}?page=${page}#top`);
}
