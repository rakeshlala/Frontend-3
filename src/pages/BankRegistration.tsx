import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import "animate.css"

/* ---------------- ALL COUNTRIES (ISO LIST) ---------------- */
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh",
  "Belgium","Brazil","Canada","China","Colombia","Denmark","Egypt","Finland","France",
  "Germany","Greece","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Japan","Kenya","Malaysia","Mexico","Netherlands","New Zealand",
  "Nigeria","Norway","Pakistan","Philippines","Poland","Portugal","Qatar","Romania",
  "Russia","Saudi Arabia","Singapore","South Africa","South Korea","Spain","Sri Lanka",
  "Sweden","Switzerland","Thailand","Turkey","UAE","UK","Ukraine","USA","Vietnam","Zimbabwe"
]

/* ---------------- STATES BY COUNTRY ---------------- */
const STATES: Record<string, string[]> = {
  India: [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu",
    "Telangana","Uttar Pradesh","Uttarakhand","West Bengal"
  ],
  USA: [
    "California","Texas","Florida","New York","Illinois","Pennsylvania",
    "Ohio","Georgia","North Carolina","Michigan"
  ],
  UK: ["England","Scotland","Wales","Northern Ireland"],
  Canada: ["Ontario","Quebec","British Columbia","Alberta","Manitoba"],
  Australia: ["New South Wales","Victoria","Queensland","Western Australia","Tasmania"]
}

export default function Register() {
  const navigate = useNavigate()
  const { dark } = useTheme()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    country: "",
    state: "",
    terms: false
  })

  const [errors, setErrors] = useState<any>({})

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e: any = {}

    if (!/^[A-Za-z ]{3,50}$/.test(form.name))
      e.name = "Name must contain only letters (min 3)"

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
      e.email = "Invalid email address"

    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters"

    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match"

    if (!/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Enter valid 10-digit Indian mobile number"

    if (!form.dob) {
      e.dob = "Date of birth required"
    } else {
      const age = new Date().getFullYear() - new Date(form.dob).getFullYear()
      if (age < 18) e.dob = "You must be 18+"
    }

    if (!form.gender) e.gender = "Select gender"
    if (!form.country) e.country = "Select country"

    if (STATES[form.country] && !form.state)
      e.state = "Select state"

    if (!form.terms) e.terms = "Accept terms & conditions"

    return e
  }

  const submit = (e: any) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)

    if (Object.keys(v).length === 0) {
      console.log(form)
      navigate("/bank_details")
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className={`min-vh-100 d-flex justify-content-center align-items-center ${dark ? "bg-dark text-white" : "bg-light text-dark"}`}>
      <div className="card shadow-lg animate__animated animate__fadeInUp"
        style={{ width: "100%", maxWidth: "1100px", borderRadius: "20px", background: dark ? "#020617" : "#fff" }}
      >
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <h2 className="fw-bold">User Registration</h2>
          <X role="button" onClick={() => navigate("/")} />
        </div>

        {/* FORM */}
        <form className="p-5" onSubmit={submit}>
          <div className="row g-4">

            {/* NAME */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name</label>
              <input className="form-control form-control-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <small className="text-danger">{errors.name}</small>
            </div>

            {/* EMAIL */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" className="form-control form-control-lg"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <small className="text-danger">{errors.email}</small>
            </div>

            {/* PASSWORD */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control form-control-lg"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <small className="text-danger">{errors.password}</small>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input type="password" className="form-control form-control-lg"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
              <small className="text-danger">{errors.confirmPassword}</small>
            </div>

            {/* PHONE */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Mobile Number</label>
              <input className="form-control form-control-lg"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                }
              />
              <small className="text-danger">{errors.phone}</small>
            </div>

            {/* DOB */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Date of Birth</label>
              <input type="date" className="form-control form-control-lg"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
              <small className="text-danger">{errors.dob}</small>
            </div>

            {/* GENDER */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Gender</label>
              <select className="form-select form-select-lg"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <small className="text-danger">{errors.gender}</small>
            </div>

            {/* COUNTRY */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Country</label>
              <select className="form-select form-select-lg"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value, state: "" })}
              >
                <option value="">Select</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <small className="text-danger">{errors.country}</small>
            </div>

            {/* STATE (CONDITIONAL) */}
            {STATES[form.country] && (
              <div className="col-md-6">
                <label className="form-label fw-semibold">State</label>
                <select className="form-select form-select-lg"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                >
                  <option value="">Select</option>
                  {STATES[form.country].map(s => <option key={s}>{s}</option>)}
                </select>
                <small className="text-danger">{errors.state}</small>
              </div>
            )}
          </div>

          {/* TERMS */}
          <div className="form-check mt-4">
            <input className="form-check-input" type="checkbox"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
            />
            <label className="form-check-label">I accept Terms & Conditions</label>
            <div className="text-danger">{errors.terms}</div>
          </div>

          {/* SUBMIT */}
          <div className="d-grid mt-4">
            <button className="btn btn-success btn-lg py-3">
              Proceed to Bank Setup
            </button>
          </div>

          <p className="text-center mt-3">
            Already registered?{" "}
            <span className="text-primary fw-semibold" role="button"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}
