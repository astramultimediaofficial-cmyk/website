import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import ErrorSection from "@/component/error/ErrorSection";
import Layout from "@/component/layout/Layout";
import TeamDetailSection from "@/component/team/TeamDetailSection";
import { teamData } from "@/data/Data";
export const metadata = {
  title: "Astra Team Details Page",
  description: "Developed by Azizur Rahman",
};

export async function generateStaticParams() {
  return teamData.map((item) => ({ slug: item.slug }));
}

export default function TeamDetails({ params }) {
  const { slug } = params;
  const teamDesc = teamData.find((item) => item.slug === slug);
  return (
    <Layout>
      <BreadcrumbSection header="Team Details" title="Team Details" />
      {teamDesc ? (
        <TeamDetailSection teamInfo={teamDesc} />
      ) : (
        <ErrorSection type="Team Member" />
      )}
    </Layout>
  );
}
