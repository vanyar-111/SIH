import { useState, useEffect } from "react"

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [auth, setAuth] = useState(null)

    useEffect(() => {
        if (window.firebase && !window.firebase.apps.length) {
            const firebaseConfig = {
                apiKey: "AIzaSyAXWYNOVZ_MBXq40SUgKDoY3Rh_VJ-4Q9A",
                authDomain: "microplastics-detector.firebaseapp.com",
                projectId: "microplastics-detector",
                storageBucket: "microplastics-detector.appspot.com",
                messagingSenderId: "180775836921",
                appId: "1:180775836921:web:094ca4390c074cc8eb9628",
            }
            window.firebase.initializeApp(firebaseConfig)
            setAuth(window.firebase.auth())
        } else if (window.firebase) {
            setAuth(window.firebase.auth())
        }
    }, [])

    const handleLogin = async () => {
        if (!auth) return setError("Firebase not loaded yet")
        try {
            await auth.signInWithEmailAndPassword(email, password)

            // Show confirm popup
            if (
                window.confirm(
                    "Admin Login Successful!\n\nClick OK to View Dashboard"
                )
            ) {
                window.location.href =
                    "https://app.powerbi.com/links/H1MHTOTTTr?ctid=27282fdd-4c0b-4dfb-ba91-228cd83fdf71&pbi_source=linkShare"
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div
            style={{
                width: "350px",
                margin: "80px auto",
                padding: "40px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                textAlign: "center",
                color: "white",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
                width="60"
                height="60"
                fill="black"
                style={{
                    marginBottom: "20px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <path
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 
           248-111 248-248S385 8 248 8zm0 96c52.9 0 
           96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 
           43.1-96 96-96zm0 344c-59.6 0-112.5-29.1-145.6-74.3 
           7.3-48.3 48.1-85.7 97.6-85.7h96c49.5 0 90.3 37.4 
           97.6 85.7C360.5 418.9 307.6 448 248 448z"
                />
            </svg>

            <h2
                style={{
                    color: "black",
                    fontFamily: "'Montserrat', sans-serif",
                }}
            >
                Admin Login
            </h2>

            <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                }}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                }}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button
                onClick={handleLogin}
                style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "black",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                }}
            >
                Login
            </button>
        </div>
    )
}
