import streamlit as st
import os
import sys
# Ensure the package root (neurosentinel-2050) is on sys.path so we can import utils
pkg_root = os.path.dirname(os.path.dirname(__file__))
if pkg_root not in sys.path:
    sys.path.insert(0, pkg_root)
import utils

def render():
    st.header("Phishing Detection")
    url = st.text_input("URL / Link to analyze")
    email_text = st.text_area("Email body (optional)")
    check_method = st.selectbox("Method", ["Rule-based", "ML (placeholder)"])
    if st.button("Analyze"):
        result = utils.phishing_check(url=url, text=email_text)
        if result['threat']:
            st.error(f"Threat detected: {result['reason']}")
        else:
            st.success("No phishing indicators found")
        st.info(result)
