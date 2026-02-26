import React, { useState } from 'react';

const SoarBuilder = () => {
  const [steps, setSteps] = useState([
    { id: 1, type: 'notify_slack', params: { message: 'Alert triggered' } }
  ]);

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), type: 'block_ip', params: { ip: '1.2.3.4' } }]);
  };

  const run = async () => {
    // naive run: execute steps sequentially via existing SOAR endpoint
    for (const s of steps) {
      await fetch('/api/soar/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbook: s.type, params: s.params })
      });
    }
    alert('Workflow executed');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">SOAR Workflow Builder</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Compose incident response playbooks</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="space-y-3">
          {steps.map((s) => (
            <div key={s.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{s.type}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{JSON.stringify(s.params)}</div>
              </div>
              <button onClick={() => setSteps(steps.filter(x => x.id !== s.id))} className="text-red-600 dark:text-red-400">Remove</button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-3">
          <button onClick={addStep} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">Add Step</button>
          <button onClick={run} className="px-4 py-2 rounded bg-emerald-600 text-white">Run</button>
        </div>
      </div>
    </div>
  );
};

export default SoarBuilder;






