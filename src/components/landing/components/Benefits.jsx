import React from 'react';
import Image from "next/image";
import { Link } from "@/lib/router";
import { FiCheck } from "react-icons/fi";

const Benefits = () => {
  const benefitsList = [
    "Secure and convenient transactions",
    "Optimum satisfaction",
    "Quick delivery",
    "Exceptional customer support"
  ];

  return (
    <section className="landing-section benefits-section">
      <div className="container">
        <div className="benefits-grid">
          
          {/* Image Side */}
          <div className="benefits-image-wrapper">
            <div className="benefits-image-frame"></div>
            <div className="benefits-image">
              <Image
                src="https://988xx940gr.ufs.sh/f/SiVOobhIM9I8Wyo7Ogi5j9lMFAZ6sdTgSfW4tmy3n2qK1NvC"
                alt="Durable my boss"
                fill
                sizes="(max-width: 768px) 80vw, 420px"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="benefits-text">
            <h6 className="section-eyebrow">Why You Should Choose Us</h6>
            <h2 className="section-title">Benefits You Stand To Enjoy With Us</h2>
            
            <p className="benefits-lead">
              Our user-friendly app & secure online platform make managing your finances easy.
            </p>

            <ul className="benefits-list">
              {benefitsList.map((item, index) => (
                <li key={index}>
                  <span className="check-icon"><FiCheck size={14} strokeWidth={3} /></span>
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/register" className="btn btn-gold">
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Benefits;