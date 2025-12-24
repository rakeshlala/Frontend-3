import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"

/* ================= COUNTRIES ================= */
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh",
  "Belgium","Brazil","Canada","China","Colombia","Denmark","Egypt","Finland","France",
  "Germany","Greece","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland",
  "Israel","Italy","Japan","Kenya","Malaysia","Mexico","Netherlands","New Zealand",
  "Nigeria","Norway","Pakistan","Philippines","Poland","Portugal","Qatar","Romania",
  "Russia","Saudi Arabia","Singapore","South Africa","South Korea","Spain","Sri Lanka",
  "Sweden","Switzerland","Thailand","Turkey","UAE","UK","Ukraine","USA","Vietnam","Zimbabwe"
]

/* ================= INDIA STATES ================= */
const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
]

/* ================= BANKS ================= */
const BANKS = [
  "State Bank of India","HDFC Bank","ICICI Bank","Axis Bank","Punjab National Bank",
  "Bank of Baroda","Canara Bank","Union Bank of India","IDBI Bank","Indian Bank",
  "Central Bank of India","Kotak Mahindra Bank","Yes Bank","IndusInd Bank",
  "Federal Bank","South Indian Bank","RBL Bank","Bandhan Bank",
  "AU Small Finance Bank","Ujjivan Small Finance Bank","Equitas Small Finance Bank"
]

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<any>({})

  /* ✅ PIN REFS (NO TS ERROR) */
  const loginPinRef = useRef<(HTMLInputElement | null)[]>([])
  const paymentPinRef = useRef<(HTMLInputElement | null)[]>([])

  const [form, setForm] = useState<any>(() => {
    const saved = sessionStorage.getItem("registerForm")
    return saved ? JSON.parse(saved) : {
      name:"", email:"", password:"", confirmPassword:"",
      phone:"", dob:"", gender:"",
      country:"", state:"",
      bankHolder:"", bankName:"", accountNo:"", ifsc:"",
      loginPin:["","","",""],
      paymentPin:["","","",""],
      terms:false,
      locationAllowed:false
    }
  })

  /* ================= SAVE FORM ON REFRESH ================= */
  useEffect(() => {
    sessionStorage.setItem("registerForm", JSON.stringify(form))
  }, [form])

  /* ================= LOCATION ================= */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setForm((f:any)=>({...f, locationAllowed:true})),
        () => setErrors((e:any)=>({...e, location:"Location permission required"}))
      )
    }
  }, [])

  /* ================= VALIDATION ================= */
  const validateStep1 = () => {
    const e:any={}
    if (!/^[A-Za-z ]{3,50}$/.test(form.name)) e.name="Invalid full name"
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email="Invalid email"
    if (form.password.length<6) e.password="Minimum 6 characters"
    if (form.password!==form.confirmPassword) e.confirmPassword="Passwords do not match"
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone="Invalid mobile number"
    if (!form.dob) e.dob="Date of birth required"
    if (!form.gender) e.gender="Select gender"
    if (!form.country) e.country="Select country"
    if (form.country==="India" && !form.state) e.state="Select state"
    if (!form.locationAllowed) e.location="Allow location permission"
    if (!form.terms) e.terms="Accept terms & conditions"
    return e
  }

  const validateStep2 = () => {
    const e:any={}
    if (!form.bankHolder) e.bankHolder="Required"
    if (!form.bankName) e.bankName="Select bank"
    if (!/^\d{9,18}$/.test(form.accountNo)) e.accountNo="Invalid account number"
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) e.ifsc="Invalid IFSC code"
    return e
  }

  const validateStep3 = () => {
    const e:any={}
    if (form.loginPin.some((p:string)=>p==="")) e.loginPin="Login PIN required"
    if (form.paymentPin.some((p:string)=>p==="")) e.paymentPin="Payment PIN required"
    return e
  }

  /* ================= PIN HANDLERS ================= */
  const pinChange = (
    key: "loginPin" | "paymentPin",
    index: number,
    val: string
  ) => {
    if (!/^\d?$/.test(val)) return
    const p=[...form[key]]
    p[index]=val
    setForm({...form,[key]:p})

    const refArr = key==="loginPin" ? loginPinRef : paymentPinRef
    if (val && index < 3) refArr.current[index+1]?.focus()
  }

  const pinBack = (
    key: "loginPin" | "paymentPin",
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key==="Backspace" && !form[key][index] && index>0) {
      const refArr = key==="loginPin" ? loginPinRef : paymentPinRef
      refArr.current[index-1]?.focus()
    }
  }

  const next = async () => {
    let e:any={}
    if (step===1) e=validateStep1()
    if (step===2) e=validateStep2()
    if (step===3) e=validateStep3()

    setErrors(e)
    if (Object.keys(e).length!==0) return

    if (step===3) {
      await fetch("http://localhost:5000/api/register",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(form)
      })
      sessionStorage.removeItem("registerForm")
      navigate("/home")
    } else setStep(step+1)
  }

  /* ================= UI ================= */
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow" style={{width:"100%",maxWidth:1200,borderRadius:16}}>
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
          <h3 className="fw-bold mb-0">User Registration</h3>
          <X role="button" size={26} onClick={()=>navigate("/")}/>
        </div>

        <div className="p-5">
           {/* STEP 1 */}
          {step===1 && (
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input className="form-control" onChange={e=>setForm({...form,name:e.target.value})}/>
                <small className="text-danger">{errors.name}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" onChange={e=>setForm({...form,email:e.target.value})}/>
                <small className="text-danger">{errors.email}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input type="password" className="form-control"
                  onChange={e=>setForm({...form,password:e.target.value})}/>
                <small className="text-danger">{errors.password}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control"
                  onChange={e=>setForm({...form,confirmPassword:e.target.value})}/>
                <small className="text-danger">{errors.confirmPassword}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Mobile Number</label>
                <input className="form-control" maxLength={10}
                  onChange={e=>setForm({...form,phone:e.target.value.replace(/\D/g,"")})}/>
                <small className="text-danger">{errors.phone}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-control"
                  onChange={e=>setForm({...form,dob:e.target.value})}/>
                <small className="text-danger">{errors.dob}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <select className="form-select"
                  onChange={e=>setForm({...form,gender:e.target.value})}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <small className="text-danger">{errors.gender}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Country</label>
                <select className="form-select"
                  onChange={e=>setForm({...form,country:e.target.value,state:""})}>
                  <option value="">Select</option>
                  {COUNTRIES.map(c=><option key={c}>{c}</option>)}
                </select>
                <small className="text-danger">{errors.country}</small>
              </div>

              {form.country==="India" && (
                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <select className="form-select"
                    onChange={e=>setForm({...form,state:e.target.value})}>
                    <option value="">Select</option>
                    {INDIA_STATES.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <small className="text-danger">{errors.state}</small>
                </div>
              )}

              <div className="col-12">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input"
                    onChange={e=>setForm({...form,terms:e.target.checked})}/>
                  <label className="form-check-label">I accept Terms & Conditions</label>
                </div>
                <small className="text-danger">{errors.terms || errors.location}</small>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">Bank Holder Name</label>
                <input className="form-control"
                  onChange={e=>setForm({...form,bankHolder:e.target.value})}/>
                <small className="text-danger">{errors.bankHolder}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Bank</label>
                <select className="form-select"
                  onChange={e=>setForm({...form,bankName:e.target.value})}>
                  <option value="">Select</option>
                  {BANKS.map(b=><option key={b}>{b}</option>)}
                </select>
                <small className="text-danger">{errors.bankName}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">Account Number</label>
                <input className="form-control"
                  onChange={e=>setForm({...form,accountNo:e.target.value})}/>
                <small className="text-danger">{errors.accountNo}</small>
              </div>

              <div className="col-md-6">
                <label className="form-label">IFSC Code</label>
                <input className="form-control"
                  onChange={e=>setForm({...form,ifsc:e.target.value.toUpperCase()})}/>
                <small className="text-danger">{errors.ifsc}</small>
              </div>
            </div>
          )}
          {step===3 && (
            <>
              <label className="form-label">Login PIN</label>
              <div className="d-flex gap-2">
                {form.loginPin.map((_:any,i:number)=>(
                  <input
                    key={i}
                    maxLength={1}
                    className="form-control text-center"
                    ref={el => { loginPinRef.current[i]=el }}
                    onChange={e=>pinChange("loginPin",i,e.target.value)}
                    onKeyDown={e=>pinBack("loginPin",i,e)}
                  />
                ))}
              </div>
              <small className="text-danger">{errors.loginPin}</small>

              <label className="form-label mt-3">Payment PIN</label>
              <div className="d-flex gap-2">
                {form.paymentPin.map((_:any,i:number)=>(
                  <input
                    key={i}
                    maxLength={1}
                    className="form-control text-center"
                    ref={el => { paymentPinRef.current[i]=el }}
                    onChange={e=>pinChange("paymentPin",i,e.target.value)}
                    onKeyDown={e=>pinBack("paymentPin",i,e)}
                  />
                ))}
              </div>
              <small className="text-danger">{errors.paymentPin}</small>
            </>
          )}

          <button className="btn btn-success btn-lg w-100 mt-4" onClick={next}>
            {step===3?"Finish":"Proceed to Bank Setup"}
          </button>
        </div>
      </div>
    </div>
  )
}
