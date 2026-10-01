import React from 'react';
import { SERVICES } from "@/constants/landing";
import { FiArrowUpRight } from "react-icons/fi";

const Services = () => {
  return (
    <section className="landing-section services-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <h6 className="section-eyebrow">Our Services</h6>
          <h2 className="section-title">What We Do</h2>
          <div className="section-line"></div>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {SERVICES.map(({ icon: Icon, title, text }, index) => (
            <div key={index} className="service-card">
              <div className="service-icon-wrapper">
                <Icon size={28} />
              </div>
              
              <div className="service-body">
                <h3>{title}</h3>
                <p>{text}</p>
                
                <div className="service-action" aria-hidden="true">
                  <span className="service-btn">
                    <FiArrowUpRight size={20} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;