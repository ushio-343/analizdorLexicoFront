import './App.css'
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [textAreaValue, setTextAreaValue] = useState('');
  const [tokenData, setTokenData] = useState([]);
  const [lexicalErrors, setLexicalErrors] = useState([]);

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setTextAreaValue(event.target.result);
    };

    reader.readAsText(file);
  };

  const handleAnalyzeCode = async () => {
    try {
      const response = await axios.post('http://localhost:8000/analyze/', { code: textAreaValue });
      setTokenData(response.data.token_data);
      setLexicalErrors(response.data.lexical_errors);
    } catch (error) {
      console.error("There was an error processing your request:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-1">
        <input type="file" onChange={handleFileChange} className="py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300" />
        <div className="mt-3">
          <h2>File Content:</h2>
          <textarea className="mt-3 w-full h-32 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 bg-gray-200" value={textAreaValue} onChange={handleTextAreaChange} />
          <button onClick={handleAnalyzeCode} className="mt-3 w-full inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Analizar código
          </button>

          <div className="mt-3 overflow-x-auto relative shadow-md sm:rounded-lg">
            {tokenData.length > 0 && (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 px-6">Token</th>
                    <th scope="col" className="py-3 px-6">PR</th>
                    <th scope="col" className="py-3 px-6">ID</th>
                    <th scope="col" className="py-3 px-6">SIM</th>
                    <th scope="col" className="py-3 px-6">ERROR</th>
                  </tr>
                </thead>
                <tbody>
                  {tokenData.map((entry, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="py-4 px-6">{entry.token}</td>
                      <td className="py-4 px-6">{entry.PR}</td>
                      <td className="py-4 px-6">{entry.ID}</td>
                      <td className="py-4 px-6">{entry.SIM}</td>
                      <td className="py-4 px-6">{entry.ERROR}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {lexicalErrors.length > 0 && (
              <div className="mt-3">
                <h2>Lexical Errors</h2>
                <ul className="list-disc list-inside">
                  {lexicalErrors.map((error, index) => (
                    <li key={index} className="text-red-500">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
