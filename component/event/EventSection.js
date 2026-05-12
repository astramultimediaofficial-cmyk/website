"use client";
import React from "react";
import EventSlider from "../slider/EventSlider";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const EventSection = ({ section, startIndex, endIndex }) => {
  return (
    <section className={section} style={{ position: "relative" }}>
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="row">
          <div className="col-xl-6 col-md-8 col-lg-6 m-auto wow fadeInUp">
            <div className="tf__heading_area mb_40">
              <h5>OUR Upcoming Events</h5>
              <h2>Join Our Intensive One-Day Workshops.</h2>
            </div>
          </div>
        </div>
        <EventSlider startIndex={startIndex} endIndex={endIndex} />
      </div>
    </section>
  );
};

export default EventSection;
