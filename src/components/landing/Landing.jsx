import { Link } from "@/lib/router";
import { FiMail, FiPhone } from "react-icons/fi";
import LandingNav from "./components/LandingNav";
import Hero from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Benefits from "./components/Benefits";
import CtaSection from "./components/CtaSection";

const name = () => process.env.REACT_APP_NAME || "Our platform";

/** Public landing page: glass nav + hero, services, about, benefits, footer. */
export default function Landing() {
  const play = process.env.REACT_APP_GOOGLE_PLAY;
  const ios = process.env.REACT_APP_IOS_PLAY;

  return (
    <div className="landing-page">
      <LandingNav />
      <main>
        <Hero />
        <CtaSection />
        <div className="landing landing-body">
          <div className="landing-bg" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <Services />
          <About />
          <Benefits />
        </div>
      </main>

      <div className="landing">
        <footer className="landing-footer">
          <div>
            <strong>{name()}</strong>
            <div className="foot-links">
              {process.env.REACT_APP_AGENT_EMAIL && (
                <span><FiMail /> {process.env.REACT_APP_AGENT_EMAIL}</span>
              )}
              {process.env.REACT_APP_AGENT_TELEPHONE && (
                <span><FiPhone /> {process.env.REACT_APP_AGENT_TELEPHONE}</span>
              )}
            </div>
          </div>
          <div className="foot-links">
            {play && <a href={play} target="_blank" rel="noreferrer">Google Play</a>}
            {ios && <a href={ios} target="_blank" rel="noreferrer">App Store</a>}
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          <small>© {new Date().getFullYear()} {name()}. All rights reserved.</small>
        </footer>
      </div>
    </div>
  );
}
