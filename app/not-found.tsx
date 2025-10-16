import Layout from "../components/layout";
import PageNotFound from "../components/PageNotFound/PageNotFound";

export default function NotFound() {
  return (
    <Layout home={false} canonicalUrl="">
      <PageNotFound />
    </Layout>
  );
}
