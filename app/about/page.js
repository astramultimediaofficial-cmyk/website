import AboutSection from "@/component/about/AboutSection";
import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import FaqSection from "@/component/faq/FaqSection";
import Layout from "@/component/layout/Layout";
export const metadata = {
  title: "Astra Multimedia | About Us",
  description: "Industry-standard training in multimedia and digital arts.",
}
export default function About() {
    return (
        <Layout>
            <BreadcrumbSection header="About us" title="About us"/>
            <section className="tf__about_us_page mt_195 xs_mt_100">
                <AboutSection/>
                <FaqSection img="images/faq_img_2.jpg"/>
            </section>
        </Layout>
    )
}