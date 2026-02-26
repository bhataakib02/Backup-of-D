import streamlit as st
from pages import home, phishing, malware, intrusion, ransomware, ddos, insider, threat_intel, fusion, explainable_ai, predictive, soar, quantum, red_blue, soc_copilot, global_map, network_security
import os

PAGES = {
    "Home": home,
    "Phishing Detection": phishing,
    "Malware Detection": malware,
    "Intrusion Detection": intrusion,
    "Ransomware": ransomware,
    "DDoS Protection": ddos,
    "Insider Threat": insider,
    "Threat Intelligence": threat_intel,
    "Fusion Engine": fusion,
    "Explainable AI": explainable_ai,
    "Predictive Analytics": predictive,
    "SOAR Automation": soar,
    "Quantum-Safe Layer": quantum,
    "Red vs Blue Simulator": red_blue,
    "SOC Copilot": soc_copilot,
    "Global Threat Map": global_map,
    "Network Security": network_security,
}

st.set_page_config(page_title="NeuroSentinel-2050", layout="wide")

# load custom css
css_path = os.path.join(os.path.dirname(__file__), 'static', 'style.css')
if os.path.exists(css_path):
    with open(css_path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.sidebar.title("NeuroSentinel-2050")
page_names = list(PAGES.keys())
selection = st.sidebar.selectbox("Navigate", page_names)

page = PAGES[selection]
page.render()
