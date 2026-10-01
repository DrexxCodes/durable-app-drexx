import { useRef } from "react";
import { Link } from "@/lib/router";
import { FiArrowRight } from "react-icons/fi";
import { CTA_COPY } from "@/constants/landing";
import { useRevealOnce } from "@/hooks/useRevealOnce";

/** Continues the hero: starts brand-coloured, then eases to the page canvas. */
const CtaSection = () => {
  const ref = useRef(null);
  const on = useRevealOnce(ref, 0.35);

  return (
    <section ref={ref} className={`cta-section${on ? " on" : ""}`}>
      <div className="cta-inner">
        <span className="cta-label">{CTA_COPY.eyebrow}</span>
        <h2>
          {CTA_COPY.title[0]}
          <br />
          {CTA_COPY.title[1]}
        </h2>
        <p>{CTA_COPY.text}</p>
        <div className="cta-actions">
          <Link to="/register" className="btn btn-gold btn-lg px-4">
            Create free account <FiArrowRight />
          </Link>
          <Link to="/login" className="btn btn-outline-light-glass btn-lg px-4">
            I already have an account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
