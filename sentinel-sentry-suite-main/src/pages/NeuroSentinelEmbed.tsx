import React from 'react'

const STREAMLIT_URL = (import.meta.env.VITE_STREAMLIT_URL as string) || 'http://localhost:8501'

export default function NeuroSentinelEmbed() {
  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: 12, background: '#0f172a', color: 'white'}}>
        <h2 style={{margin: 0}}>NeuroSentinel-2050 (Embedded)</h2>
        <div style={{fontSize: 12, opacity: 0.85}}>Streamlit app embedded from: {STREAMLIT_URL}</div>
      </div>
      <iframe
        title="NeuroSentinel Streamlit"
        src={STREAMLIT_URL}
        style={{flex: 1, border: 'none', width: '100%'}}
      />
    </div>
  )
}
