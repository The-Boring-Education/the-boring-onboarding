import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { initGA, installGlobalAnalyticsListeners } from "@tbe/utils"
import Onboarding from "./pages/Onboarding"
import "./index.css"

/**
 * Onboarding App
 *
 * Completely refactored to use shared TBE packages
 * Minimal app that focuses only on routing and initialization
 */
function App() {
    useEffect(() => {
        // Initialize analytics using shared utility
        initGA()
        installGlobalAnalyticsListeners()
    }, [])

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Onboarding />} />
                <Route path='/onboarding' element={<Onboarding />} />
                {/* Catch all route */}
                <Route path='*' element={<Onboarding />} />
            </Routes>
        </Router>
    )
}

export default App
