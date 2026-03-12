import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ParticleField from './components/ParticleField'
import Home from './pages/Home'
import Game from './pages/Game'
import Results from './pages/Results'
import Leaderboard from './pages/Leaderboard'

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen mesh-bg relative">
                <ParticleField />
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </BrowserRouter>
    )
}

export default App
