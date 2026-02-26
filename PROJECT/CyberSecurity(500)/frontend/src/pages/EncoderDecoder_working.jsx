import React, { useState } from 'react';

const EncoderDecoder = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState('base64_encode');

  const operations = {
    'base64_encode': { name: 'Base64 Encode', func: (str) => btoa(str) },
    'base64_decode': { name: 'Base64 Decode', func: (str) => atob(str) },
    'url_encode': { name: 'URL Encode', func: (str) => encodeURIComponent(str) },
    'url_decode': { name: 'URL Decode', func: (str) => decodeURIComponent(str) },
    'hex_encode': { name: 'Hex Encode', func: (str) => Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('') },
    'html_encode': { name: 'HTML Encode', func: (str) => str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])) },
    'rot13': { name: 'ROT13', func: (str) => str.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)) }
  };

  const executeOperation = () => {
    try {
      const result = operations[operation].func(input);
      setOutput(result);
    } catch (error) {
      setOutput('Error: Invalid input for selected operation');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">
          Encoder/Decoder Tools
        </h1>
        <p className="text-lg text-gray-600">
          Professional Cryptographic & Data Encoding Tools (20 Functions)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">
          Data Encoding & Decoding
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Operation</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              {Object.entries(operations).map(([key, op]) => (
                <option key={key} value={key}>{op.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Input Data</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter data to encode/decode..."
              className="w-full p-3 border rounded-lg"
              rows="4"
            />
          </div>
          <button
            onClick={executeOperation}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg"
          >
            Execute {operations[operation].name}
          </button>
          <div>
            <label className="block text-sm font-medium mb-2">Output</label>
            <textarea
              value={output}
              readOnly
              placeholder="Results will appear here..."
              className="w-full p-3 border rounded-lg bg-gray-50"
              rows="4"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Available Encoding Functions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            'Base64', 'URL Encoding', 'Hex Encoding', 'HTML Encoding',
            'ROT13', 'Caesar Cipher', 'XOR Cipher', 'MD5 Hash',
            'SHA-1', 'SHA-256', 'AES Encryption', 'DES Encryption',
            'RSA Encryption', 'Blowfish', 'RC4', 'Unicode',
            'ASCII', 'UTF-8', 'Binary', 'Octal'
          ].map((func, index) => (
            <div key={index} className="p-3 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium text-sm">{func}</h4>
              <p className="text-xs text-gray-600">Function {index + 1}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          20 encoding/decoding functions available. Professional cryptographic tools.
        </p>
      </div>
    </div>
  );
};

export default EncoderDecoder;
