import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [reportType, setReportType] = useState('executive_summary');
  const [format, setFormat] = useState('pdf');
  const [complianceStandards, setComplianceStandards] = useState([]);
  const [customSections, setCustomSections] = useState([]);
  const [filters, setFilters] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState(null);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadTemplates();
    loadScheduledReports();
    loadAnalytics();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await fetch('/api/reports/templates');
      const data = await res.json();
      if (data.success) setTemplates(data.templates);
    } catch (e) {
      console.error('Failed to load templates:', e);
    }
  };

  const loadScheduledReports = async () => {
    try {
      const res = await fetch('/api/reports/scheduled');
      const data = await res.json();
      if (data.success) setScheduledReports(data.scheduled_reports);
    } catch (e) {
      console.error('Failed to load scheduled reports:', e);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/reports/analytics');
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
  };

  const generate = async () => {
    setDownloading(true);
    setError('');
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: reportType,
          format: format,
          filters: filters,
          compliance_standards: complianceStandards,
          custom_sections: customSections
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to generate');
      
      setSummary(data.report);
      
      // Trigger download based on format
      if (format === 'pdf' && data.report.content) {
        const a = document.createElement('a');
        a.href = `data:application/pdf;base64,${data.report.content}`;
        a.download = `${reportType.replace(/_/g, '_')}_report.pdf`;
        a.click();
      } else if (format === 'html' && data.report.content) {
        const blob = new Blob([data.report.content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType.replace(/_/g, '_')}_report.html`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'json' && data.report.content) {
        const blob = new Blob([data.report.content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType.replace(/_/g, '_')}_report.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">Executive Security Reports</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Generate comprehensive, compliance-ready security reports</p>
      </div>

      {/* Report Generation Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Generate New Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              {templates?.report_types?.map((type) => (
                <option key={type.type} value={type.type}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              {templates?.formats?.map((fmt) => (
                <option key={fmt.format} value={fmt.format}>{fmt.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compliance Standards</label>
            <select
              multiple
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={complianceStandards}
              onChange={(e) => setComplianceStandards(Array.from(e.target.selectedOptions, option => option.value))}
            >
              {templates?.compliance_standards?.map((std) => (
                <option key={std.standard} value={std.standard}>{std.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={generate}
            disabled={downloading}
            className={`px-8 py-3 rounded-lg text-white font-semibold text-lg ${downloading ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {downloading ? 'Generating Report...' : 'Generate Report'}
          </button>
        </div>
        
        {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{error}</div>}
      </div>

      {/* Report Summary */}
      {summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Report Generated Successfully</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Report ID: {summary.metadata?.report_id}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Generated: {new Date(summary.metadata?.generated_at).toLocaleString()}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Format: {summary.metadata?.format?.toUpperCase()}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Size: {(summary.size / 1024).toFixed(1)} KB</div>
            </div>
            <div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Type: {summary.metadata?.report_type?.replace('_', ' ').toUpperCase()}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Version: {summary.metadata?.version}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Confidentiality: {summary.metadata?.confidentiality_level}</div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Reporting Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Reports Generated</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.report_generation_stats?.total_reports_generated}</div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Reports This Month</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.report_generation_stats?.reports_this_month}</div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.report_generation_stats?.success_rate}</div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Generation Time</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.report_generation_stats?.average_generation_time}</div>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Reports */}
      {scheduledReports.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Scheduled Reports</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Run</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {scheduledReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{report.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.report_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.frequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(report.next_run).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;




