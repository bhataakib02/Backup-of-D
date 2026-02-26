import requests

def check_threat_intel(pwd, api_key):
    try:
        headers = {'x-apikey': api_key}
        response = requests.get(f"https://www.virustotal.com/api/v3/files/{hash(pwd)}", headers=headers)
        return response.json().get('data', {}).get('attributes', {}).get('last_analysis_stats', {}).get('malicious', 0)
    except:
        return 0