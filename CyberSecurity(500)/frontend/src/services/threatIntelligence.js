// Threat Intelligence Service
// This service simulates real-time threat data feeds from various sources

class ThreatIntelligenceService {
  constructor() {
    this.threatFeeds = [
      'CISA Feed',
      'MITRE ATT&CK',
      'VirusTotal',
      'ThreatConnect',
      'AlienVault OTX',
      'MISP',
      'IBM X-Force',
      'CrowdStrike',
      'FireEye',
      'Palo Alto Networks'
    ];
    
    this.threatTypes = [
      'DDoS Attack',
      'Phishing Campaign',
      'Malware Distribution',
      'Ransomware Attack',
      'Data Breach',
      'Botnet Activity',
      'Cryptocurrency Mining',
      'Social Engineering',
      'Zero-Day Exploit',
      'Insider Threat',
      'Supply Chain Attack',
      'IoT Compromise',
      'APT Campaign',
      'Credential Stuffing',
      'Business Email Compromise'
    ];

    this.countries = [
      'United States', 'China', 'Russia', 'Germany', 'United Kingdom', 'France',
      'Japan', 'South Korea', 'India', 'Brazil', 'Canada', 'Australia', 'Italy',
      'Spain', 'Netherlands', 'Sweden', 'Norway', 'Finland', 'Poland', 'Turkey',
      'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador',
      'Uruguay', 'Paraguay', 'Bolivia', 'Guyana', 'Suriname', 'French Guiana'
    ];

    this.severityLevels = ['Low', 'Medium', 'High', 'Critical'];
    this.statusTypes = ['Active', 'Contained', 'Investigating', 'Resolved'];
  }

  // Generate realistic threat data
  generateThreatData(count = 20) {
    const threats = [];
    
    for (let i = 0; i < count; i++) {
      const threat = {
        id: Date.now() + Math.random(),
        type: this.getRandomItem(this.threatTypes),
        country: this.getRandomItem(this.countries),
        severity: this.getRandomItem(this.severityLevels),
        status: this.getRandomItem(this.statusTypes),
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        source: this.getRandomItem(this.threatFeeds),
        confidence: Math.floor(Math.random() * 40) + 60,
        affectedSystems: Math.floor(Math.random() * 1000) + 1,
        description: this.generateThreatDescription(),
        indicators: this.generateIndicators(),
        impact: this.generateImpact(),
        recommendations: this.generateRecommendations()
      };
      
      threats.push(threat);
    }
    
    return threats;
  }

  // Generate threat description based on type
  generateThreatDescription() {
    const descriptions = {
      'DDoS Attack': 'Distributed Denial of Service attack targeting critical infrastructure',
      'Phishing Campaign': 'Large-scale phishing campaign targeting financial institutions',
      'Malware Distribution': 'Malware distribution campaign using social engineering tactics',
      'Ransomware Attack': 'Ransomware attack encrypting critical business data',
      'Data Breach': 'Unauthorized access to sensitive customer information',
      'Botnet Activity': 'Botnet infrastructure used for malicious activities',
      'Cryptocurrency Mining': 'Cryptocurrency mining malware infecting enterprise systems',
      'Social Engineering': 'Social engineering attack targeting employees',
      'Zero-Day Exploit': 'Zero-day vulnerability exploitation in the wild',
      'Insider Threat': 'Malicious insider activity detected',
      'Supply Chain Attack': 'Supply chain compromise affecting multiple organizations',
      'IoT Compromise': 'IoT device compromise used for network infiltration',
      'APT Campaign': 'Advanced Persistent Threat campaign targeting high-value assets',
      'Credential Stuffing': 'Credential stuffing attack using compromised credentials',
      'Business Email Compromise': 'Business email compromise targeting financial transactions'
    };
    
    return descriptions[this.getRandomItem(this.threatTypes)] || 'Unknown threat activity detected';
  }

  // Generate threat indicators
  generateIndicators() {
    const indicators = [];
    const count = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < count; i++) {
      indicators.push({
        type: this.getRandomItem(['IP', 'Domain', 'Hash', 'Email', 'URL']),
        value: this.generateIndicatorValue(),
        confidence: Math.floor(Math.random() * 40) + 60
      });
    }
    
    return indicators;
  }

  // Generate indicator value based on type
  generateIndicatorValue() {
    const types = {
      'IP': () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      'Domain': () => `malicious-${Math.random().toString(36).substr(2, 8)}.com`,
      'Hash': () => Math.random().toString(36).substr(2, 32),
      'Email': () => `suspicious-${Math.random().toString(36).substr(2, 6)}@malicious.com`,
      'URL': () => `https://malicious-${Math.random().toString(36).substr(2, 8)}.com/payload`
    };
    
    const type = this.getRandomItem(Object.keys(types));
    return types[type]();
  }

  // Generate impact assessment
  generateImpact() {
    const impacts = [
      'Financial loss estimated at $50,000 - $500,000',
      'Customer data exposure affecting 1,000 - 10,000 individuals',
      'System downtime of 2-8 hours',
      'Reputation damage and customer trust loss',
      'Regulatory compliance violations',
      'Intellectual property theft',
      'Operational disruption',
      'Supply chain disruption'
    ];
    
    return this.getRandomItem(impacts);
  }

  // Generate security recommendations
  generateRecommendations() {
    const recommendations = [
      'Implement multi-factor authentication',
      'Update security patches immediately',
      'Conduct security awareness training',
      'Implement network segmentation',
      'Deploy endpoint detection and response',
      'Enhance monitoring and logging',
      'Review and update incident response plan',
      'Conduct vulnerability assessment',
      'Implement zero-trust architecture',
      'Enhance email security controls'
    ];
    
    const count = Math.floor(Math.random() * 3) + 1;
    const selected = [];
    
    for (let i = 0; i < count; i++) {
      const rec = this.getRandomItem(recommendations);
      if (!selected.includes(rec)) {
        selected.push(rec);
      }
    }
    
    return selected;
  }

  // Get random item from array
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Get threat statistics
  getThreatStatistics(threats) {
    const stats = {
      totalThreats: threats.length,
      activeAttacks: threats.filter(t => t.status === 'Active').length,
      countriesAffected: new Set(threats.map(t => t.country)).size,
      severityBreakdown: {
        Critical: threats.filter(t => t.severity === 'Critical').length,
        High: threats.filter(t => t.severity === 'High').length,
        Medium: threats.filter(t => t.severity === 'Medium').length,
        Low: threats.filter(t => t.severity === 'Low').length
      },
      topThreatTypes: this.getTopThreatTypes(threats),
      topCountries: this.getTopCountries(threats),
      lastUpdate: new Date()
    };
    
    return stats;
  }

  // Get top threat types
  getTopThreatTypes(threats) {
    const typeCount = {};
    threats.forEach(threat => {
      typeCount[threat.type] = (typeCount[threat.type] || 0) + 1;
    });
    
    return Object.entries(typeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
  }

  // Get top countries by threat count
  getTopCountries(threats) {
    const countryCount = {};
    threats.forEach(threat => {
      countryCount[threat.country] = (countryCount[threat.country] || 0) + 1;
    });
    
    return Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));
  }

  // Simulate real-time threat feed
  startRealTimeFeed(callback, interval = 30000) {
    const feed = () => {
      const newThreats = this.generateThreatData(5);
      const stats = this.getThreatStatistics(newThreats);
      callback({ threats: newThreats, stats });
    };
    
    // Initial feed
    feed();
    
    // Set up interval
    return setInterval(feed, interval);
  }

  // Stop real-time feed
  stopRealTimeFeed(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
}

export default new ThreatIntelligenceService();

