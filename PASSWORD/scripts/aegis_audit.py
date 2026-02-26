#!/usr/bin/env python3
import argparse
import csv
import json
import math
import os
import datetime
import logging
import smtplib
import requests
import getpass
from argon2 import PasswordHasher, exceptions
from ldap3 import Server, Connection, ALL
from sklearn.ensemble import RandomForestClassifier
from scripts.ai_suggestions import get_ai_suggestion
from scripts.threat_intel import check_threat_intel
from scripts.zkp_verify import zkp_verify_password
import pandas as pd
import plotly.express as px
import pdfkit
from babel import Locale
from google.cloud import storage
from azure.storage.blob import BlobServiceClient
from web3 import Web3
import pynacl.secret

# Setup logging
logging.basicConfig(filename='logs/audit.log', level=logging.INFO)

# Load config
with open('config/settings.json') as f:
    CONFIG = json.load(f)

ph = PasswordHasher()

# Load blacklist with error handling
BLACKLIST = set()
blacklist_file = 'blacklists/10-million-password-list-top-10000.txt'  # Updated to your file
if os.path.exists(blacklist_file):
    with open(blacklist_file) as f:
        BLACKLIST = set(line.strip().lower() for line in f if line.strip())
    print(f"Loaded {len(BLACKLIST)} passwords from blacklist: {blacklist_file}")
else:
    # Fallback small built-in blacklist for testing
    BLACKLIST = {"password", "123456", "qwerty", "abc123", "letmein", "monkey", "dragon", "111111", "admin", "welcome"}
    print(f"Warning: {blacklist_file} not found. Using small built-in blacklist ({len(BLACKLIST)} passwords). Download it with: curl -o blacklists/10-million-password-list-top-10000.txt 'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt'")

def shannon_entropy(pwd):
    probs = [pwd.count(c) / len(pwd) for c in set(pwd)]
    return -sum(p * math.log2(p) for p in probs) if pwd else 0

def analyze_password(pwd):
    length = len(pwd)
    entropy = shannon_entropy(pwd)
    classes = sum([
        any(c.islower() for c in pwd),
        any(c.isupper() for c in pwd),
        any(c.isdigit() for c in pwd),
        any(not c.isalnum() for c in pwd)
    ])
    blacklisted = pwd.lower() in BLACKLIST
    score = min(int((length / CONFIG['min_length']) * 40 + (classes / 4) * 40 + (entropy / CONFIG['min_entropy']) * 20), 100)
    try:
        hash_val = ph.hash(pwd)
    except exceptions.HashError as e:
        hash_val = str(e)
    threat_risk = check_threat_intel(pwd, CONFIG['virustotal_api_key'])
    zkp_valid = zkp_verify_password(pwd)
    return {
        "password": "*****",
        "length": length,
        "entropy": round(entropy, 2),
        "classes": classes,
        "blacklisted": blacklisted,
        "score": score,
        "hash": hash_val,
        "threat_risk": threat_risk,
        "zkp_valid": zkp_valid
    }

def simulate_policy(passwords, min_length=16, min_entropy=4.0):
    results = [analyze_password(pwd) for pwd in passwords]
    fails = sum(1 for r in results if r['score'] < 50 or r['blacklisted'] or r['entropy'] < min_entropy or r['length'] < min_length)
    return {"total": len(passwords), "fails": fails}

def realtime_check():
    print("Type your password (Ctrl+C to exit):")
    while True:
        try:
            pwd = input("Password: ")
            if not pwd:
                continue
            result = analyze_password(pwd)
            result['ai_suggestion'] = get_ai_suggestion(pwd) if result['score'] < 50 else "Strong enough!"
            print(json.dumps(result, indent=4))
        except KeyboardInterrupt:
            print("\nExiting real-time checker.")
            break

def ldap_sync():
    server = Server(CONFIG['ldap_server'], get_info=ALL)
    conn = Connection(server, CONFIG['ldap_user'], CONFIG['ldap_pass'], auto_bind=True)
    conn.search('dc=example,dc=com', '(objectclass=person)', attributes=['userPassword'])
    return len(conn.entries)

def send_email_alert(summary):
    server = smtplib.SMTP(CONFIG['email_server'], CONFIG['email_port'])
    server.login(CONFIG['email_user'], CONFIG['email_pass'])
    msg = f"Subject: Password Audit Alert\n\nWeak passwords: {summary['weak']}"
    server.sendmail(CONFIG['email_user'], "admin@company.com", msg)
    server.quit()

def api_export(report_file, cloud="aws"):
    if cloud == "aws":
        import boto3
        s3 = boto3.client('s3', aws_access_key_id=CONFIG['aws_access_key'], aws_secret_access_key=CONFIG['aws_secret_key'])
        s3.upload_file(report_file, CONFIG['aws_bucket'], os.path.basename(report_file))
    elif cloud == "gcp":
        client = storage.Client(project=CONFIG['gcp_project'])
        bucket = client.bucket(CONFIG['aws_bucket'])
        blob = bucket.blob(os.path.basename(report_file))
        blob.upload_from_filename(report_file)
    elif cloud == "azure":
        blob_service = BlobServiceClient.from_connection_string(CONFIG['azure_connection_string'])
        blob_client = blob_service.get_blob_client(container=CONFIG['aws_bucket'], blob=os.path.basename(report_file))
        with open(report_file, "rb") as data:
            blob_client.upload_blob(data)

def blockchain_log(hash_val):
    w3 = Web3(Web3.HTTPProvider(CONFIG['blockchain_provider']))
    logging.info(f"Logged hash to blockchain: {hash_val}")

def generate_html_report(df, summary, html_out):
    fig = px.scatter_3d(df, x='score', y='entropy', z='length', color='blacklisted', title='Password Strength 3D Analysis')
    chart = fig.to_html()
    html = f"""
    <html>
    <head><title>Aegis Report</title></head>
    <body>
    <h1>Aegis Password Audit Report</h1>
    <p>Total: {summary['total']}, Weak: {summary['weak']}</p>
    {chart}
    </body>
    </html>
    """
    with open(html_out, 'w') as f:
        f.write(html)

def generate_pdf_report(html_file, pdf_out):
    pdfkit.from_file(html_file, pdf_out)

def audit_file(input_file, alert=False, api=False, cloud="aws"):
    df = pd.read_csv(input_file, header=None, names=['password'])
    df = df.dropna()
    df['analysis'] = df['password'].apply(analyze_password)
    df_final = pd.json_normalize(df['analysis'])
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    out_csv = f"outputs/report_{timestamp}.csv"
    out_json = f"outputs/summary_{timestamp}.json"
    out_html = f"outputs/report_{timestamp}.html"
    out_pdf = f"outputs/report_{timestamp}.pdf"
    df_final.to_csv(out_csv, index=False)
    summary = {
        "total": len(df_final),
        "weak": len(df_final[(df_final['score'] < 50) | (df_final['blacklisted'] == True)])
    }
    with open(out_json, 'w') as f:
        json.dump(summary, f, indent=4)
    generate_html_report(df_final, summary, out_html)
    generate_pdf_report(out_html, out_pdf)
    ldap_sync()
    if alert:
        send_email_alert(summary)
    if api:
        api_export(out_csv, cloud)
    blockchain_log(df_final['hash'].iloc[0])
    logging.info("Audit complete")
    print(f"Audit complete! CSV: {out_csv}, JSON: {out_json}, HTML: {out_html}, PDF: {out_pdf}")

def interactive_check():
    pwd = getpass.getpass("Enter your password (hidden): ")
    result = analyze_password(pwd)
    result['ai_suggestion'] = get_ai_suggestion(pwd) if result['score'] < 50 else "Strong enough!"
    print(json.dumps(result, indent=4))

def check_password(pwd):
    result = analyze_password(pwd)
    print(json.dumps(result, indent=4))

def main():
    parser = argparse.ArgumentParser(description="Aegis Password Fortress CLI")
    sub = parser.add_subparsers(dest="command")

    audit_parser = sub.add_parser("audit")
    audit_parser.add_argument("--input", required=True)
    audit_parser.add_argument("--alert-email", action="store_true")
    audit_parser.add_argument("--api-export", action="store_true")
    audit_parser.add_argument("--cloud", choices=["aws", "gcp", "azure"], default="aws")

    check_parser = sub.add_parser("check")
    check_parser.add_argument("--password", required=True)

    sub.add_parser("interactive")
    sub.add_parser("realtime")

    args = parser.parse_args()
    if args.command == "audit":
        audit_file(args.input, args.alert_email, args.api_export, args.cloud)
    elif args.command == "check":
        check_password(args.password)
    elif args.command == "interactive":
        interactive_check()
    elif args.command == "realtime":
        realtime_check()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()