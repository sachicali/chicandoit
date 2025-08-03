import React, { useState } from 'react';
import { X, Settings, Bell, Palette, Clock, Save } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    accountabilityInterval: 60,
    enableNotifications: true,
    workHoursStart: '09:00',
    workHoursEnd: '17:00',
    autoStart: false,
    minimizeToTray: true,
    theme: 'auto',
    aiInsightsEnabled: true,
    desktopNotifications: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    // In a real implementation, this would call a Tauri command
    console.log('Saving settings:', settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Notifications</span>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Enable Notifications</label>
                  <p className="text-sm text-gray-600">Receive productivity reminders and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Desktop Notifications</label>
                  <p className="text-sm text-gray-600">Show system notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.desktopNotifications}
                    onChange={(e) => handleSettingChange('desktopNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-gray-900">Accountability Check Interval</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="15"
                    max="240"
                    step="15"
                    value={settings.accountabilityInterval}
                    onChange={(e) => handleSettingChange('accountabilityInterval', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm font-medium text-gray-900 w-20">
                    {settings.accountabilityInterval} min
                  </span>
                </div>
                <p className="text-sm text-gray-600">How often you receive accountability check-ins</p>
              </div>
            </div>
          </div>

          {/* Work Hours Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Work Hours</span>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={settings.workHoursStart}
                    onChange={(e) => handleSettingChange('workHoursStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-900 mb-2">End Time</label>
                  <input
                    type="time"
                    value={settings.workHoursEnd}
                    onChange={(e) => handleSettingChange('workHoursEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">Notifications will be more frequent during work hours</p>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <Palette className="w-5 h-5 text-purple-600" />
              <span>Appearance</span>
            </div>
            
            <div className="space-y-4 pl-7">
              <div>
                <label className="block font-medium text-gray-900 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <label key={theme} className="cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={settings.theme === theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="sr-only peer"
                      />
                      <div className="border-2 border-gray-200 rounded-lg p-3 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                        <div className="font-medium text-gray-900 capitalize">{theme}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Application Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Application</span>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Start with System</label>
                  <p className="text-sm text-gray-600">Launch ChiCanDoIt when your computer starts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoStart}
                    onChange={(e) => handleSettingChange('autoStart', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Minimize to System Tray</label>
                  <p className="text-sm text-gray-600">Keep running in background when window is closed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.minimizeToTray}
                    onChange={(e) => handleSettingChange('minimizeToTray', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">AI Insights</label>
                  <p className="text-sm text-gray-600">Enable AI-powered productivity insights</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.aiInsightsEnabled}
                    onChange={(e) => handleSettingChange('aiInsightsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Settings are saved automatically</p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;