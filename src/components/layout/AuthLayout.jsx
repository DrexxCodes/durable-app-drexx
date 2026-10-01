import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";

/** Centered card shell shared by login / register / activate / reset screens. */
export default function AuthLayout({ children, nobg }) {
  return (
    <div className={`auth-screen ${nobg ? "" : "auth-bg"}`}>
      <div className="auth-card">
        <div className="auth-brand">
          <Logo size={44} />
        </div>
        <Container className="px-0">{children}</Container>
      </div>
    </div>
  );
}
