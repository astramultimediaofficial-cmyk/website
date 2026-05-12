import BreadcrumbSection from "@/component/breadcrumb/BreadcrumbSection";
import ContactPageSection from "@/component/contact/ContactPageSection";
import Layout from "@/component/layout/Layout";
export const metadata = {
  title: "Astra Multimedia | Contact",
  description: "Contact Astra Multimedia in Coimbatore.",
}
export default function Contact() {
    return (
        <Layout>
            <BreadcrumbSection header='Contact Us' title="Contact us"/>
            <ContactPageSection/>
        </Layout>
    )
}