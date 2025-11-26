const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return "";
  const allowedTags = [
    "p",
    "br",
    "b",
    "i",
    "em",
    "strong",
    "u",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
  ];
  let clean = dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "");
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  clean = clean.replace(tagPattern, (match, tag) =>
    allowedTags.includes(tag.toLowerCase()) ? match : ""
  );
  return clean.replace(/\n/g, "<br />");
};

interface Tag {
  name: string;
}

interface LastFMData {
  artist?: {
    bio?: {
      content?: string;
    };
    tags?: {
      tag?: Tag[];
    };
  };
  error?: any;
}

interface ArtistBioProps {
  name: string;
  lastFMdata?: LastFMData;
}

const ArtistBio = ({ name, lastFMdata }: ArtistBioProps) => {
  const bioContent = lastFMdata?.artist?.bio?.content;
  const tags = lastFMdata?.artist?.tags?.tag;
  const hasTags = Array.isArray(tags) && tags.length > 0;
  const hasContent = bioContent || hasTags;

  // Show fallback message if no data available
  if (!lastFMdata || lastFMdata.error || !hasContent) {
    return (
      <div className="px-2.5 max-w-3xl mx-auto text-center mt-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          No information is currently available for this artist. Please check
          back later.
        </p>
      </div>
    );
  }

  return (
    <div className="px-2.5 max-w-3xl mx-auto [&_p]:text-md text-left">
      {hasTags && (
        <div className="text-center">
          <h3 className="font-normal mt-4 text-lg text-pink pb-3">
            Music Style
          </h3>
          <div className="[&_span]:py-1 [&_span]:px-4 [&_span]:m-1 [&_span]:border [&_span]:border-gray-300 [&_span]:dark:border-gray-600 [&_span]:rounded-2xl [&_span]:text-xs [&_span]:text-center [&_span]:inline-block [&_span]:bg-gray-200 [&_span]:dark:bg-gray-700 [&_span]:text-gray-600 [&_span]:dark:text-gray-400">
            {tags.map((tag) => (
              <span key={tag.name} className="artist-tag">
                {tag.name.toLowerCase().replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {bioContent && (
        <>
          <h2 className="font-normal mt-10 text-lg text-pink md:inline-block md:text-xl pb-3">
            About {name}
          </h2>
          <div
            className="artist-bio-text"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(bioContent),
            }}
          />
        </>
      )}
    </div>
  );
};

export default ArtistBio;
