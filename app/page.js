import AboutSection from "@/component/about/AboutSection";
import BannerSection from "@/component/banner/BannerSection";
import CategorySection from "@/component/category/CategorySection";
import EventSection from "@/component/event/EventSection";
import FaqSection from "@/component/faq/FaqSection";
import FooterSection from "@/component/footer/FooterSection";
import VideoModal from "@/component/modal/VideoModal";
import NavbarSection from "@/component/navbar/NavbarSection";
import TestimonialSection from "@/component/testimonial/TestimonialSection";
import ScrollToTopButton from "@/component/utils/ScrollToTopButton";
import WorkSection from "@/component/work/WorkSection";

export const metadata = {
  title: "Astra Multimedia | Home",
  description: "Excellence in digital education from the experts.",
};

export default function Home() {
  return (
    <>
      <NavbarSection style="" logo="images/logo.png" />
      <BannerSection />
      <CategorySection />
      <AboutSection />
      <EventSection section="tf__event mt_95" startIndex={0} endIndex={4} />
      <FaqSection img="images/faq_img.jpg" />
      <WorkSection />
      <TestimonialSection />
      <FooterSection />
      <VideoModal />
      <ScrollToTopButton style="" />
    </>
  );
}
