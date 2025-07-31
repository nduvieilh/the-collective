import React, { useState, useEffect } from 'react';
import { bedrockService } from '../services/bedrockService';
import type { BedrockConfig as BedrockConfigType } from '../types';

interface BedrockConfigProps {
  onConfigured: () => void;
}

export const BedrockConfig: React.FC<BedrockConfigProps> = ({ onConfigured }) => {
  const [config, setConfig] = useState<BedrockConfigType>({
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: '',
    modelId: 'us.anthropic.claude-sonnet-4-20250514-v1:0',
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if configuration exists in localStorage
    const savedConfig = localStorage.getItem('bedrockConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        bedrockService.initialize(parsedConfig);
        setIsConfigured(true);
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    }
  }, []);

  const handleSaveConfig = () => {
    if (!config.accessKeyId.trim() || !config.secretAccessKey.trim()) {
      setError('Please provide both Access Key ID and Secret Access Key');
      return;
    }

    try {
      bedrockService.initialize(config);
      localStorage.setItem('bedrockConfig', JSON.stringify(config));
      setIsConfigured(true);
      setError('');
      onConfigured();
    } catch (error) {
      setError('Failed to initialize Bedrock service');
      console.error('Bedrock initialization error:', error);
    }
  };

  const handleClearConfig = () => {
    localStorage.removeItem('bedrockConfig');
    setConfig({
      region: 'us-east-1',
      accessKeyId: '',
      secretAccessKey: '',
      modelId: 'us.anthropic.claude-sonnet-4-20250514-v1:0',
    });
    setIsConfigured(false);
    setError('');
  };

  if (isConfigured) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-green-800">AWS Bedrock Configured</h3>
            <p className="text-sm text-green-600">
              Region: {config.region} | Model: {config.modelId}
            </p>
          </div>
          <button
            onClick={handleClearConfig}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reconfigure
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
      <h3 className="text-lg font-medium text-yellow-800 mb-4">Configure AWS Bedrock</h3>
      <p className="text-sm text-yellow-700 mb-4">
        To use the chatroom, you need to configure your AWS Bedrock credentials. 
        Your credentials will be stored locally in your browser.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AWS Region
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            us-east-1 (US East - N. Virginia)
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model ID
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            us.anthropic.claude-sonnet-4-20250514-v1:0 (Claude Sonnet 4)
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AWS Access Key ID
          </label>
          <input
            type="text"
            value={config.accessKeyId}
            onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })}
            placeholder="AKIA..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AWS Secret Access Key
          </label>
          <input
            type="password"
            value={config.secretAccessKey}
            onChange={(e) => setConfig({ ...config, secretAccessKey: e.target.value })}
            placeholder="Enter your secret access key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Security Note</h4>
          <p className="text-sm text-blue-700">
            Your AWS credentials are stored locally in your browser and are never sent to any external servers 
            except AWS Bedrock. Make sure you're using credentials with minimal required permissions for Bedrock access.
          </p>
        </div>

        <button
          onClick={handleSaveConfig}
          disabled={!config.accessKeyId.trim() || !config.secretAccessKey.trim()}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
