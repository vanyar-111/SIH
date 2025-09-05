import { useEffect, useState } from "react"

/**
 * AdminLogin (Framer-ready)
 * - Uses global window.firebase (v8 or v9-compat)
 * - Email/Password sign-in
 * - Clear error messages
 * - Redirects to /dashboard on success
 * - Optional "Forgot password" link
 */

export default function AdminLogin() {
    // ---- UI state ----
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [auth, setAuth] = useState<any>(null)

    // ---- your firebase config ----
    const firebaseConfig = {
        apiKey: "AIzaSyAXWYNOVZ_MBXq40SUgKDoY3Rh_VJ-4Q9A",
        authDomain: "microplastics-detector.firebaseapp.com",
        projectId: "microplastics-detector",
        storageBucket: "microplastics-detector.appspot.com",
        messagingSenderId: "180775836921",
        appId: "1:180775836921:web:094ca4390c074cc8eb9628",
    }

    // Initialize Firebase once (from global <script> tags)
    useEffect(() => {
        if (typeof window === "undefined") return
        const fb = (window as any).firebase

        if (!fb) {
            setError("Firebase SDK not found. Check Custom Code → <head> tags.")
            setLoading(false)
            return
        }

        try {
            // v8 or v9-compat both expose fb.apps
            if (!fb.apps.length) fb.initializeApp(firebaseConfig)
            const _auth = fb.auth()

            // Persist session in the browser
            _auth.setPersistence(fb.auth.Auth.Persistence.LOCAL).catch(() => {})

            setAuth(_auth)
        } catch (e: any) {
            setError(e?.message || "Failed to initialize Firebase.")
        } finally {
            setLoading(false)
        }
    }, [])

    // Handle sign-in
    const handleLogin = async () => {
        if (!auth) {
            setError("Firebase not ready yet. Please wait a moment.")
            return
        }
        setError("")
        try {
            await auth.signInWithEmailAndPassword(email.trim(), password)
            // ✅ IMPORTANT: must match the page URL exactly (case-sensitive)
            window.location.assign("/dashboard")
        } catch (err: any) {
            // Friendlier errors
            const code: string = err?.code || ""
            if (code.includes("auth/invalid-email"))
                setError("Invalid email format.")
            else if (code.includes("auth/user-not-found"))
                setError("No user with this email.")
            else if (code.includes("auth/wrong-password"))
                setError("Incorrect password.")
            else if (code.includes("auth/network-request-failed"))
                setError("Network error. Try again.")
            else setError(err?.message || "Login failed.")
        }
    }

    // Optional: Forgot password
    const handleReset = async () => {
        if (!auth) return
        setError("")
        try {
            await auth.sendPasswordResetEmail(email.trim())
            alert("Password reset email sent (if the account exists).")
        } catch (e: any) {
            setError(
                "Could not send reset email. Check the address and try again."
            )
        }
    }

    // ---- UI (keeps your glassy theme) ----
    return (
        <div
            style={{
                width: 350,
                margin: "80px auto",
                padding: 40,
                borderRadius: 20,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                textAlign: "center",
                color: "white",
            }}
        >
            {/* tiny admin logo (uses PNG if provided; falls back to your SVG) */}
            <div
                style={{
                    marginBottom: 14,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {/* replace src with your Framer asset URL if you have one */}
                <img
                    src="" /* e.g. "https://framerusercontent.com/images/your-admin-icon.png" */
                    alt=""
                    onError={(e) => {
                        // fallback to SVG if no image
                        ;(e.currentTarget as HTMLImageElement).outerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" width="60" height="60" fill="black"
                   style="display:block; margin:0 auto; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35));">
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96zm0 344c-59.6 0-112.5-29.1-145.6-74.3 7.3-48.3 48.1-85.7 97.6-85.7h96c49.5 0 90.3 37.4 97.6 85.7C360.5 418.9 307.6 448 248 448z"/>
              </svg>`
                    }}
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        objectFit: "cover",
                        boxShadow: "0 4px 14px rgba(0,0,0,.35)",
                        // subtle glow on hover
                        transition: "box-shadow .2s ease",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(77,166,255,.55)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow =
                            "0 4px 14px rgba(0,0,0,.35)")
                    }
                />
            </div>
            <h2
                style={{
                    color: "black",
                    fontFamily: "'Montserrat', sans-serif",
                    marginBottom: 16,
                }}
            >
                Admin Login
            </h2>

            {loading ? (
                <p style={{ color: "#ddd" }}>Loading…</p>
            ) : (
                <>
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        style={{
                            width: "100%",
                            padding: 12,
                            marginBottom: 12,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            outline: "none",
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        style={{
                            width: "100%",
                            padding: 12,
                            marginBottom: 8,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            outline: "none",
                        }}
                    />

                    <div style={{ textAlign: "right", marginBottom: 12 }}>
                        <button
                            onClick={handleReset}
                            style={{
                                fontSize: 12,
                                background: "transparent",
                                color: "#dbe5ff",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>

                    {error && (
                        <p
                            style={{
                                color: "salmon",
                                minHeight: 20,
                                marginTop: 0,
                                marginBottom: 12,
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleLogin}
                        style={{
                            width: "100%",
                            padding: 12,
                            borderRadius: 8,
                            border: "none",
                            background: "black",
                            color: "white",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        Login
                    </button>
                </>
            )}
        </div>
    )
}
