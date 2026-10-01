import { useRef } from "react";
import { FiArrowDown } from "react-icons/fi";
import { HERO_COPY } from "@/constants/landing";
import { useInversionScroll } from "@/hooks/useInversionScroll";

/** The same copy is rendered twice: ink on canvas, and white inside the circle. */
const HeroCopy = () => (
  <>
    {/* <span className="pill hero-pill">Airtime · Data · Bills</span> */}
    <h1>
      {HERO_COPY.before} <span className="text-gold">{HERO_COPY.highlight}</span>
    </h1>
    <p>{HERO_COPY.text}</p>
    <span className="hero-scroll">
      {HERO_COPY.hint} <FiArrowDown />
    </span>
  </>
);

/** Full-width, scroll-driven hero (see hooks/useInversionScroll). */
const Hero = () => {
  const trackRef = useRef(null);
  const heroRef = useRef(null);
  const ballRef = useRef(null);
  const lightRef = useRef(null);
  useInversionScroll({ trackRef, heroRef, ballRef, lightRef });

  return (
    <div ref={trackRef} className="icsa-track">
      <section ref={heroRef} className="icsa-hero">
        <div ref={ballRef} className="icsa-ball" aria-hidden="true" />

        <div className="icsa-layer icsa-dark">
          <HeroCopy />
        </div>

        {/* decorative duplicate, clipped to the circle */}
        <div ref={lightRef} className="icsa-layer icsa-light" aria-hidden="true">
          <HeroCopy />
        </div>
      </section>
    </div>
  );
};

export default Hero;
