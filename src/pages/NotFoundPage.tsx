import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Civilezy</title>
      </Helmet>
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 20px" }}>
        <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 700, color: "#FF6200", marginBottom: "16px" }}>
          404
        </h1>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", marginBottom: "32px" }}>
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg,#FF6200,#FF4500)", color: "white", textDecoration: "none", padding: "14px 28px", borderRadius: "50px", fontFamily: "Nunito, sans-serif", fontSize: "16px", fontWeight: 800 }}
        >
          Go Home
        </Link>
      </div>
    </>
  );
}
