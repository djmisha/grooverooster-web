/**
 * OrganizationStructuredData renders JSON-LD structured data for the
 * GrooveRooster organization, improving Knowledge Panel visibility in
 * Google Search results.
 */
const OrganizationStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GrooveRooster",
    url: "https://www.grooverooster.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.grooverooster.com/images/housemusic.png",
      width: 1200,
      height: 630,
    },
    description:
      "Find the best electronic music events, shows, and festivals in your city. Track your favorite artists and never miss a beat.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};

export default OrganizationStructuredData;
