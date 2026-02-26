import React, { useState } from 'react';

const DLP = () => {
  const [content, setContent] = useState('John Doe, john@example.com, +1 555 123 4567');
  const [tags, setTags] = useState([]);
  const [resourceId, setResourceId] = useState('res-123');

  const classify = async () => {
    const res = await fetch('/api/dlp/classify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
    const data = await res.json();
    if (data.success) setTags(data.tags || []);
  };

  const tag = async () => {
    const res = await fetch('/api/dlp/tag', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource_id: resourceId, tags }) });
    await res.json();
    alert('Tags saved');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">Data Loss Prevention (DLP)</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Classify and tag sensitive data</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow space-y-4">
        <textarea className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={content} onChange={(e)=>setContent(e.target.value)} />
        <div className="flex items-center space-x-3">
          <button onClick={classify} className="px-4 py-2 rounded bg-pink-600 text-white">Classify</button>
          <div className="text-sm text-gray-700 dark:text-gray-300">Tags: {tags.join(', ') || 'None'}</div>
        </div>
        <div className="flex items-center space-x-3">
          <input className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={resourceId} onChange={(e)=>setResourceId(e.target.value)} />
          <button onClick={tag} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">Save Tags</button>
        </div>
      </div>
    </div>
  );
};

export default DLP;






