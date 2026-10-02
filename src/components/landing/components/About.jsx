import React from "react";
import Image from "next/image";
import { Link } from "@/lib/router";

const BRAND_NAME = process.env.REACT_APP_NAME || "Durable Telecom";
const BRAND_IMAGE = process.env.REACT_APP_IMAGE_URL;

const About = () => {
  return (
    <section className="landing-section about-section">
      <div className="container">
        <div className="about-grid">

          {/* Images Collage */}
          <div className="about-images">
            <div className="about-img-back">
              <Image
                src="https://988xx940gr.ufs.sh/f/SiVOobhIM9I8twCR5AbOMGX3tWFCEiTpH41BhUeLws6fIlKz"
                alt="Team collaborating"
                fill
                sizes="(max-width: 768px) 70vw, 350px"
              />
            </div>
            <div className="about-img-front">
              <Image
                src="https://988xx940gr.ufs.sh/f/SiVOobhIM9I8f2USAJ50eMT4K1m5PRSQDjlLkFGYdp98u3n7"
                alt="Office meeting"
                fill
                sizes="(max-width: 768px) 55vw, 290px"
              />
            </div>
            <div className="about-badge">
              {BRAND_IMAGE ? (
                <Image src={BRAND_IMAGE} alt={`${BRAND_NAME} logo`} width={64} height={64} />
              ) : (
                <span>{BRAND_NAME.trim().slice(0, 2).toUpperCase()}</span>
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="about-text">
            <h6 className="section-eyebrow">About Us</h6>
            <h2 className="section-title">Who We Are</h2>
            <p className="section-desc">
              We have the BEST Features For Your Subscriptions. You can trust us with your subscriptions.
              Durable Telecommunications is your go-to platform for all your VTU needs.
            </p>
            <p className="section-desc">
              We bridge the gap between you and your service providers, ensuring seamless, instant, and affordable transactions every single time. Whether it's data, airtime, or utility bills, we've got you covered.
            </p>

            <Link to="/register" className="btn btn-gold">
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
