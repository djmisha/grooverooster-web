import Layout from "../components/layout";
import PageNotFound from "../components/PageNotFound/PageNotFound";

export const dynamic = 'force-dynamic';

/**
 * 404 Not Found page component
 * @returns {JSX.Element} Page not found error page
 */
export default function NotFound() {
  return (
    <Layout home={false} canonicalUrl="">
      <PageNotFound />
    </Layout>
  );
}
