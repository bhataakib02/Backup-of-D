import streamlit as st

def render():
    st.title("NeuroSentinel-2050: Autonomous AI Cyber Defense")
    st.subheader("Real-time detection and prediction for phishing, malware, intrusions, and more")
    st.markdown("""
    NeuroSentinel-2050 is an industrial-grade autonomous cybersecurity platform designed for the year 2050 and beyond.
    This demo app provides modular pages for phishing detection, malware analysis, intrusion detection, threat intelligence, SOAR automation,
    explainability, and more. Each page includes simple, extendable examples and placeholders for production integrations.
    """)

    col1, col2 = st.columns([2,1])
    with col1:
        st.image("https://images.unsplash.com/photo-1555949963-aa79dcee981d?auto=format&fit=crop&w=1200&q=60", caption="NeuroSentinel - Network Overview (placeholder)")
        st.markdown("""
        **Quick links**: Use the sidebar to navigate to any module. Each module has an `Analyze` button and example inputs.
        """)
    with col2:
        st.markdown("## Theme")
        theme = st.radio("Theme", ['Light','Dark'])
        if theme == 'Dark':
            st.markdown("<script>document.querySelector('html').classList.add('dark')</script>", unsafe_allow_html=True)
        else:
            st.markdown("<script>document.querySelector('html').classList.remove('dark')</script>", unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("NeuroSentinel-2050 is modular and made to be extended: add ML models, integrate with VirusTotal, Shodan, SIEMs, and more.")
