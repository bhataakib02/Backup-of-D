NeuroSentinel Combined Frontend (React) + Streamlit

Overview
--------
This project includes a React/Vite frontend and a Streamlit multi-page app (`neurosentinel-2050`). The `NeuroSentinelEmbed` React page embeds the Streamlit app via an iframe so you can run both and view the Streamlit app inside your React UI.

Quick start (PowerShell)
------------------------
1. Install Node deps (if not already):

   npm install

2. Install Python deps for the Streamlit app (use your Python executable):

   C:/Path/To/python.exe -m pip install -r .\neurosentinel-2050\requirements.txt

3. Start both services (this will open two PowerShell windows):

   .\start-all.ps1

4. Open the React app (default Vite dev server URL printed by `npm run dev`) and navigate to the `NeuroSentinel`/Embed page. The Streamlit app is available at http://localhost:8501 and will be embedded at that URL.

Configuration
-------------
You can change the embedded Streamlit URL for React by setting an env var in `.env`:

VITE_STREAMLIT_URL=http://localhost:8501

Security note
-------------
Embedding a local Streamlit instance inside an iframe is convenient for development. When deploying, prefer to proxy the Streamlit app or host it under the same origin to avoid CSP/X-Frame-Options issues and for authentication consistency.
