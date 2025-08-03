import React from 'react';
import { MessageSquare, Mail, Users, Wifi, WifiOff, RefreshCw } from 'lucide-react';

const CommunicationPanel = ({ communications, onConnect }) => {
  const services = [
    {
      id: 'discord',
      name: 'Discord',
      icon: MessageSquare,
      color: 'indigo',
      description: 'Track Discord activity and mentions'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      icon: Mail,
      color: 'red',
      description: 'Monitor email activity and unread count'
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: Users,
      color: 'blue',
      description: 'Track Facebook Messenger activity'
    }
  ];

  const getServiceStatus = (serviceId) => {
    return communications[serviceId] || { connected: false, lastSync: null };
  };

  const formatLastSync = (lastSync) => {
    if (!lastSync) return 'Never';
    const date = new Date(lastSync);
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Communication Integrations</h3>
        <p className="text-sm text-gray-600 mt-1">
          Connect your accounts to get AI-powered insights
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {services.map((service) => {
            const status = getServiceStatus(service.id);
            const IconComponent = service.icon;
            
            return (
              <div
                key={service.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${service.color}-100`}>
                      <IconComponent className={`w-5 h-5 text-${service.color}-600`} />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      {status.lastSync && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last sync: {formatLastSync(status.lastSync)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      {status.connected ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-gray-400" />
                      )}
                      <span
                        className={`ml-2 text-sm font-medium ${
                          status.connected ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {status.connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => onConnect(service.id)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        status.connected
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {status.connected ? (
                        <div className="flex items-center">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Refresh
                        </div>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Setup Required:</strong> Configure API keys in your .env file to enable real integrations.
            Check the README.md for detailed setup instructions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;