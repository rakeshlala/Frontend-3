import { motion } from "framer-motion"
import {
  ShieldCheck,
  Cpu,
  Network,
  Workflow,
  Lock,
  GitBranch,
  Sun,
  Moon
} from "lucide-react"
import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Login from "./pages/login"
import Signup from "./pages/signup"
import Home from "./pages/Home"
import { ThemeContext } from "./context/ThemeContext"
import BankRegistration from "./pages/BankRegistration"

export default function App() {
  const [dark, setDark] = useState(true)
  const navigate = useNavigate()

  const heroBg = dark
    ? "radial-gradient(circle at top, #0f172a, #020617)"
    : "linear-gradient(135deg, #f8fafc, #eef2ff)"

  const glassBg = dark
    ? "rgba(255,255,255,0.05)"
    : "rgba(255,255,255,0.9)"

  return (
    <ThemeContext.Provider
      value={{ dark, toggleTheme: () => setDark(!dark) }}
    >
      <Routes>
        {/* LANDING PAGE */}
        <Route
          path="/"
          element={
            <div className={dark ? "bg-dark text-white" : "bg-light text-dark"}>

              {/* NAVBAR */}
              <nav
                className={`navbar fixed-top ${
                  dark ? "navbar-dark bg-black" : "navbar-light bg-white"
                } shadow-sm`}
              >
                <div className="container-fluid px-4 d-flex justify-content-between">
                  <span className="navbar-brand fw-bold fs-3 text-success">
                    AegisPay
                  </span>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setDark(!dark)}
                  >
                    {dark ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                </div>
              </nav>

              {/* HERO SECTION */}
              <section
                className="d-flex align-items-center justify-content-center text-center"
                style={{ minHeight: "100vh", background: heroBg }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="p-4 p-md-5 rounded-4 w-100"
                  style={{
                    maxWidth: "720px",
                    background: glassBg,
                    backdropFilter: "blur(18px)",
                    border: dark
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "1px solid #e5e7eb",
                    boxShadow: dark
                      ? "0 0 40px rgba(34,197,94,0.35)"
                      : "0 25px 60px rgba(0,0,0,0.1)"
                  }}
                >
                  <h1 className="fw-bold mb-3 display-6 display-md-4">
                    AI-Driven{" "}
                    <span className={dark ? "text-info" : "text-primary"}>
                      Fraud Detection
                    </span>
                  </h1>

                  <p className={dark ? "lead text-secondary" : "lead text-muted"}>
                    Protect every payment with intelligent, real-time fraud
                    prevention powered by advanced machine learning.
                  </p>

                  <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
                    <button
                      className="btn btn-success btn-lg px-5"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </button>

                    <button
                      className="btn btn-outline-primary btn-lg px-5"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                  </div>

                  <div
                    className={`d-flex flex-column flex-md-row justify-content-center gap-4 mt-5 fw-semibold ${
                      dark ? "text-info" : "text-primary"
                    }`}
                  >
                    <span>⚡ &lt;100ms</span>
                    <span>🎯 93.4% Accuracy</span>
                    <span>🔒 Bank-Grade</span>
                  </div>
                </motion.div>
              </section>

              {/* ARCHITECTURE */}
              <section className="container py-5">
                <h2 className="text-center fw-bold mb-5">
                  <span className="text-success">Multi-Layer</span> Fraud Intelligence
                </h2>

                <div className="row g-4">
                  <Feature dark={dark} icon={<ShieldCheck />} title="Rule Engine" color="success">
                    Instant blocking with zero-latency protection.
                  </Feature>

                  <Feature dark={dark} icon={<Cpu />} title="Anomaly AI" color="info">
                    Detects unknown fraud behavior automatically.
                  </Feature>

                  <Feature dark={dark} icon={<Lock />} title="Supervised ML" color="primary">
                    High-precision models trained on fraud data.
                  </Feature>

                  <Feature dark={dark} icon={<Workflow />} title="Sequence Models" color="warning">
                    Detects behavioral anomalies over time.
                  </Feature>

                  <Feature dark={dark} icon={<Network />} title="Graph AI" color="secondary">
                    Exposes fraud networks and mule rings.
                  </Feature>
                </div>
              </section>

              {/* WORKFLOW */}
              <section
                className="py-5"
                style={{
                  background: dark
                    ? "linear-gradient(135deg, #020617, #0f172a)"
                    : "linear-gradient(135deg, #ffffff, #eef2ff)"
                }}
              >
                <div className="container">
                  <h2 className="text-center fw-bold mb-5 text-info">
                    Real-Time Decision Flow
                  </h2>

                  <div className="row text-center g-4">
                    <Step dark={dark} title="Transaction Received" />
                    <Step dark={dark} title="AI Models Run" />
                    <Step dark={dark} title="Risk Scoring" />
                    <Step dark={dark} title="Final Action" />
                  </div>
                </div>
              </section>

              {/* DEMOS */}
              <section className="container py-5">
                <h2 className="text-center fw-bold mb-4 text-success">
                  Fraud Scenarios
                </h2>

                <Demo dark={dark} title="Card Testing Attack" />
                <Demo dark={dark} title="Account Takeover" />
                <Demo dark={dark} title="Mule Ring Detection" />
                <Demo dark={dark} title="Legit Transaction" />
              </section>

              {/* FOOTER */}
              <footer
                className={
                  dark
                    ? "bg-black text-secondary pt-5 pb-4"
                    : "bg-white text-muted pt-5 pb-4 border-top"
                }
              >
                <div className="container">
                  <div className="row g-4">
                    <div className="col-md-4">
                      <h5 className="fw-bold text-success">AegisPay</h5>
                      <p>
                        AI-powered fraud detection platform protecting
                        transactions in real-time.
                      </p>
                    </div>

                    <div className="col-md-4">
                      <h6 className="fw-semibold">Resources</h6>
                      <p>Documentation</p>
                      <p>GitHub Repository</p>
                    </div>

                    <div className="col-md-4">
                      <h6 className="fw-semibold">Contact</h6>
                      <p>contact@aegispay.demo</p>
                    </div>
                  </div>

                  <hr />

                  <p className="text-center small mb-0">
                    © 2025 AegisPay — Fraud Detection Demo Platform
                  </p>
                </div>
              </footer>
            </div>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/BankRegistration" element={<BankRegistration />} />
      </Routes>
    </ThemeContext.Provider>
  )
}

/* COMPONENTS */

function Feature({ icon, title, children, color, dark }: any) {
  return (
    <div className="col-md-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`card h-100 p-4 border-${color}`}
        style={{
          background: dark ? "#020617" : "#ffffff",
          color: dark ? "#ffffff" : "#111827",
          boxShadow: dark
            ? "0 0 20px rgba(255,255,255,0.05)"
            : "0 20px 40px rgba(0,0,0,0.08)"
        }}
      >
        <div className={`text-${color} mb-3`}>{icon}</div>
        <h5 className="fw-bold">{title}</h5>
        <p className={dark ? "text-secondary" : "text-muted"}>{children}</p>
      </motion.div>
    </div>
  )
}

function Step({ title, dark }: any) {
  return (
    <div className="col-md-3">
      <div
        className="card p-3 h-100"
        style={{
          background: dark ? "#020617" : "#ffffff",
          color: dark ? "#ffffff" : "#111",
          border: "1px solid #0dcaf0"
        }}
      >
        <h6 className="fw-semibold">{title}</h6>
      </div>
    </div>
  )
}

function Demo({ title, dark }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="card mb-3 p-3"
      style={{
        background: dark ? "#020617" : "#ffffff",
        color: dark ? "#ffffff" : "#111",
        border: "1px solid #198754"
      }}
    >
      <h6 className="fw-bold d-flex align-items-center gap-2">
        <GitBranch className="text-info" size={16} />
        {title}
      </h6>
    </motion.div>
  )
}
