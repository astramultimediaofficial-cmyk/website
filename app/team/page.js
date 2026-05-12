import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import Layout from "@/component/layout/Layout";
import AllTeamMemberSection from "@/component/team/AllTeamMemberSection";
export const metadata = {
  title: "Astra Multimedia | Mentors",
  description: "Meet the mentors guiding Astra Multimedia learners.",
}
export default function Team() {
    return (
        <Layout>
            <BreadcrumbSection header='Mentors' title='Mentors'/>
            <AllTeamMemberSection/>
        </Layout>
    )
}