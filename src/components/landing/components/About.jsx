import React from 'react';
import { Link } from "@/lib/router";

const About = () => {
  return (
    <section className="landing-section about-section">
      <div className="container">
        <div className="about-grid">
          
          {/* Images Collage */}
          <div className="about-images">
            <div className="about-img-back">
              <img src="https://988xx940gr.ufs.sh/f/SiVOobhIM9I8LSV4DMXwePWYiIbKquVHxaNXfQzMnOlEkojJ" alt="Team collaborating" loading="lazy" decoding="async" width="640" height="427" />
            </div>
            <div className="about-img-front">
              <img src="https://988xx940gr.ufs.sh/f/SiVOobhIM9I8f2USAJ50eMT4K1m5PRSQDjlLkFGYdp98u3n7" alt="Office meeting" loading="lazy" decoding="async" width="640" height="427" />
            </div>
            <div className="about-badge">DT</div>
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