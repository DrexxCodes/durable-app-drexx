import { Link } from "@/lib/router";
import Logo from "@/components/ui/Logo";

/** Glass nav that floats over the hero. Compact on phones (short labels, tight padding). */
const LandingNav = () => (
  <header className="landing-nav-wrap">
    <div className="landing-nav">
      <Logo size={32} withName />
      <div className="landing-nav-actions">
        <Link to="/login" className="btn btn-outline-primary1">
          Log in
        </Link>
        <Link to="/register" className="btn btn-primary1">
          <span className="d-none d-sm-inline">Get started</span>
          <span className="d-sm-none">Sign up</span>
        </Link>
      </div>
    </div>
  </header>
);

export default LandingNav;
