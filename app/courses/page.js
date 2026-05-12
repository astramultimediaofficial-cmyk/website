import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import AllCourseSection from "@/component/course/AllCourseSection";
import Layout from "@/component/layout/Layout";
export const metadata = {
  title: "Astra Multimedia | Our Courses",
  description: "Explore Astra Multimedia training programs.",
}
export default function Courses() {
    return (
        <Layout>
            <BreadcrumbSection header='Our Courses' title='Our Courses'/>
            <AllCourseSection/>
        </Layout>
    )
}