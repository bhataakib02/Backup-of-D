import streamlit as st
import os
import sys
pkg_root = os.path.dirname(os.path.dirname(__file__))
if pkg_root not in sys.path:
    sys.path.insert(0, pkg_root)
import utils

def render():
    st.header("Threat Intelligence")
    st.info("Placeholder: will integrate APIs such as VirusTotal, Shodan, etc.")
    query = st.text_input("Indicator (IP, domain, hash)")
    if st.button("Lookup"):
        st.write({"result": "mocked", "query": query})
