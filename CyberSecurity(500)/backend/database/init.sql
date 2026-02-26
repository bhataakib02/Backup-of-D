-- Database initialization script for AI/ML Cybersecurity Platform
-- This script creates the initial database structure and sample data

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cybersecurity_db;

-- Use the database
\c cybersecurity_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_category ON alerts(category);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_source_ip ON events(source_ip);
CREATE INDEX IF NOT EXISTS idx_events_destination_ip ON events(destination_ip);
CREATE INDEX IF NOT EXISTS idx_phishing_analyses_created_at ON phishing_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_malware_analyses_file_hash ON malware_analyses(file_hash);
CREATE INDEX IF NOT EXISTS idx_malware_analyses_created_at ON malware_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_ids_analyses_created_at ON ids_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_indicator_type ON threat_intelligence(indicator_type);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_indicator_value ON threat_intelligence(indicator_value);
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_is_active ON threat_intelligence(is_active);
CREATE INDEX IF NOT EXISTS idx_user_actions_timestamp ON user_actions(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_metric_name ON system_metrics(metric_name);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_alerts_title_fts ON alerts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_alerts_description_fts ON alerts USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_phishing_analyses_email_content_fts ON phishing_analyses USING gin(to_tsvector('english', email_content));

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_alerts_severity_status ON alerts(severity, status);
CREATE INDEX IF NOT EXISTS idx_alerts_category_created_at ON alerts(category, created_at);
CREATE INDEX IF NOT EXISTS idx_events_source_ip_timestamp ON events(source_ip, timestamp);
CREATE INDEX IF NOT EXISTS idx_events_destination_ip_timestamp ON events(destination_ip, timestamp);

-- Create partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(id) WHERE status != 'resolved';
CREATE INDEX IF NOT EXISTS idx_threat_intelligence_active ON threat_intelligence(id) WHERE is_active = true;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate risk score
CREATE OR REPLACE FUNCTION calculate_risk_score(
    confidence_score FLOAT,
    severity VARCHAR(20)
) RETURNS FLOAT AS $$
BEGIN
    CASE severity
        WHEN 'Critical' THEN RETURN confidence_score * 1.0;
        WHEN 'High' THEN RETURN confidence_score * 0.8;
        WHEN 'Medium' THEN RETURN confidence_score * 0.6;
        WHEN 'Low' THEN RETURN confidence_score * 0.4;
        ELSE RETURN confidence_score * 0.5;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create view for active alerts
CREATE OR REPLACE VIEW active_alerts AS
SELECT 
    a.*,
    u.username as assigned_username,
    u.email as assigned_email
FROM alerts a
LEFT JOIN users u ON a.assigned_to = u.id
WHERE a.status IN ('open', 'investigating');

-- Create view for threat intelligence summary
CREATE OR REPLACE VIEW threat_intelligence_summary AS
SELECT 
    indicator_type,
    COUNT(*) as total_indicators,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_indicators,
    AVG(confidence) as avg_confidence,
    MAX(last_seen) as last_updated
FROM threat_intelligence
GROUP BY indicator_type;

-- Create view for system metrics summary
CREATE OR REPLACE VIEW system_metrics_summary AS
SELECT 
    metric_name,
    AVG(metric_value) as avg_value,
    MIN(metric_value) as min_value,
    MAX(metric_value) as max_value,
    COUNT(*) as sample_count,
    MAX(timestamp) as last_updated
FROM system_metrics
WHERE timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
GROUP BY metric_name;

-- Insert sample threat intelligence data
INSERT INTO threat_intelligence (indicator_type, indicator_value, threat_type, severity, confidence, source, description, tags, is_active) VALUES
('ip', '192.168.1.100', 'malware', 'High', 0.95, 'VirusTotal', 'Known malware C&C server', '["malware", "c&c", "botnet"]', true),
('domain', 'malicious-site.com', 'phishing', 'Critical', 0.98, 'PhishTank', 'Phishing website targeting banking customers', '["phishing", "banking", "credential-theft"]', true),
('hash', 'a1b2c3d4e5f6789012345678901234567890abcd', 'ransomware', 'Critical', 0.99, 'MalwareBazaar', 'WannaCry ransomware variant', '["ransomware", "wannacry", "encryption"]', true),
('url', 'https://fake-bank.com/login', 'phishing', 'High', 0.92, 'OpenPhish', 'Fake banking login page', '["phishing", "banking", "fake-login"]', true);

-- Insert sample system metrics
INSERT INTO system_metrics (metric_name, metric_value, metric_unit, tags, timestamp) VALUES
('cpu_usage', 45.2, 'percent', '{"host": "server1"}', CURRENT_TIMESTAMP),
('memory_usage', 67.8, 'percent', '{"host": "server1"}', CURRENT_TIMESTAMP),
('disk_usage', 23.4, 'percent', '{"host": "server1"}', CURRENT_TIMESTAMP),
('network_in', 1024.5, 'mbps', '{"host": "server1"}', CURRENT_TIMESTAMP),
('network_out', 512.3, 'mbps', '{"host": "server1"}', CURRENT_TIMESTAMP),
('alerts_per_hour', 15.2, 'count', '{"module": "phishing"}', CURRENT_TIMESTAMP),
('alerts_per_hour', 8.7, 'count', '{"module": "malware"}', CURRENT_TIMESTAMP),
('alerts_per_hour', 23.1, 'count', '{"module": "ids"}', CURRENT_TIMESTAMP);

-- Create stored procedure for alert correlation
CREATE OR REPLACE FUNCTION correlate_alerts(
    time_window INTERVAL DEFAULT '1 hour',
    similarity_threshold FLOAT DEFAULT 0.8
) RETURNS TABLE(
    alert_id_1 INTEGER,
    alert_id_2 INTEGER,
    similarity_score FLOAT,
    correlation_type VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a1.id as alert_id_1,
        a2.id as alert_id_2,
        CASE 
            WHEN a1.source_ip = a2.source_ip THEN 0.9
            WHEN a1.destination_ip = a2.destination_ip THEN 0.8
            WHEN a1.category = a2.category THEN 0.7
            ELSE 0.5
        END as similarity_score,
        CASE 
            WHEN a1.source_ip = a2.source_ip THEN 'same_source_ip'
            WHEN a1.destination_ip = a2.destination_ip THEN 'same_destination_ip'
            WHEN a1.category = a2.category THEN 'same_category'
            ELSE 'general'
        END as correlation_type
    FROM alerts a1
    CROSS JOIN alerts a2
    WHERE a1.id < a2.id
    AND a1.created_at >= a2.created_at - time_window
    AND a1.created_at <= a2.created_at + time_window
    AND (
        a1.source_ip = a2.source_ip OR
        a1.destination_ip = a2.destination_ip OR
        a1.category = a2.category
    );
END;
$$ LANGUAGE plpgsql;

-- Create function for threat intelligence lookup
CREATE OR REPLACE FUNCTION lookup_threat_intelligence(
    indicator_value_param VARCHAR(500),
    indicator_type_param VARCHAR(50) DEFAULT NULL
) RETURNS TABLE(
    id INTEGER,
    indicator_type VARCHAR(50),
    indicator_value VARCHAR(500),
    threat_type VARCHAR(100),
    severity VARCHAR(20),
    confidence FLOAT,
    source VARCHAR(100),
    description TEXT,
    tags JSON,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ti.id,
        ti.indicator_type,
        ti.indicator_value,
        ti.threat_type,
        ti.severity,
        ti.confidence,
        ti.source,
        ti.description,
        ti.tags,
        ti.is_active
    FROM threat_intelligence ti
    WHERE ti.indicator_value = indicator_value_param
    AND (indicator_type_param IS NULL OR ti.indicator_type = indicator_type_param)
    AND ti.is_active = true
    ORDER BY ti.confidence DESC, ti.last_seen DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function for alert statistics
CREATE OR REPLACE FUNCTION get_alert_statistics(
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP - INTERVAL '24 hours',
    end_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) RETURNS TABLE(
    total_alerts BIGINT,
    critical_alerts BIGINT,
    high_alerts BIGINT,
    medium_alerts BIGINT,
    low_alerts BIGINT,
    open_alerts BIGINT,
    resolved_alerts BIGINT,
    avg_confidence FLOAT,
    avg_risk_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_alerts,
        COUNT(CASE WHEN severity = 'Critical' THEN 1 END) as critical_alerts,
        COUNT(CASE WHEN severity = 'High' THEN 1 END) as high_alerts,
        COUNT(CASE WHEN severity = 'Medium' THEN 1 END) as medium_alerts,
        COUNT(CASE WHEN severity = 'Low' THEN 1 END) as low_alerts,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_alerts,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_alerts,
        AVG(confidence_score) as avg_confidence,
        AVG(risk_score) as avg_risk_score
    FROM alerts
    WHERE created_at BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE cybersecurity_db TO cybersec_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cybersec_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cybersec_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO cybersec_user;

-- Create read-only user for reporting
CREATE USER cybersec_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE cybersecurity_db TO cybersec_readonly;
GRANT USAGE ON SCHEMA public TO cybersec_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cybersec_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO cybersec_readonly;



