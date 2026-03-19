interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbStructuredData renders JSON-LD structured data for breadcrumb
 * navigation, helping search engines understand the site hierarchy.
 */
const BreadcrumbStructuredData = ({ items }: BreadcrumbStructuredDataProps) => {
  if (!items || items.length === 0) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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

export default BreadcrumbStructuredData;
