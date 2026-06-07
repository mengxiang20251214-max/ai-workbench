import React, { useState, useEffect } from 'react'
import ParticleBackground from './components/ParticleBackground'
import Header from './components/Header'
import JournalContainer from './components/JournalContainer'

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ParticleBackground />

      <div className="relative z-10 w-full h-full flex flex-col">
        <Header />
        <JournalContainer />
      </div>
    </div>
  )
}

export default App
