"""Test phishing detection functionality."""
import unittest
from security import PhishingDetector, PhishingIndicators, analyze_forms
from bs4 import BeautifulSoup

class TestPhishingDetection(unittest.TestCase):
    def setUp(self):
        self.detector = PhishingDetector()

    def test_basic_phishing_analysis(self):
        """Test basic phishing URL analysis."""
        result = self.detector.analyze("http://suspicious.xyz/login", 
                                   "Urgent: Your account needs verification")
        self.assertIsInstance(result, dict)
        self.assertIn('threat', result)
        self.assertIn('score', result)
        self.assertIn('details', result)
        
        # Should detect suspicious TLD
        self.assertGreater(result['score'], 0.3)
        self.assertIn('suspicious_tld', result['details'])

    def test_suspicious_email_text(self):
        """Test phishing email text analysis."""
        result = self.detector.analyze(
            "http://example.com",
            "URGENT: Your account will be suspended. Login now to verify."
        )
        self.assertTrue(result['details'].get('urgency_indicators', 0) > 0)
        self.assertTrue(any('urgent' in kw.lower() 
                          for kw in result['details'].get('suspicious_keywords', [])))

    def test_html_analysis(self):
        """Test HTML content analysis."""
        html = '''
        <form action="javascript:void(0)" method="post">
            <input type="text" name="username">
            <input type="password" name="password">
            <input type="hidden" name="redirect" value="http://evil.com">
            <button>Login</button>
        </form>
        '''
        soup = BeautifulSoup(html, 'html.parser')
        forms = analyze_forms(soup)
        
        self.assertTrue(forms['login_forms'] > 0)
        self.assertTrue(any('JavaScript form action' in s 
                          for s in forms['suspicious_forms']))

    def test_domain_analysis(self):
        """Test domain analysis."""
        result = self.detector.analyze(
            "http://192.168.1.1/login.php",
            None
        )
        self.assertIn('ip_as_hostname', result['details'])
        self.assertGreater(result['score'], 0.5)

if __name__ == '__main__':
    unittest.main()