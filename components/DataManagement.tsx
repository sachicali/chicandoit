import React from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { open, save } from '@tauri-apps/api/dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { Task } from '../types';

interface DataManagementProps {
  tasks: Task[];
  onImportTasks: (tasks: Task[]) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ 
  tasks, 
  onImportTasks 
}) => {
  const exportTasks = async () => {
    try {
      const filePath = await save({
        filters: [{
          name: 'JSON Files',
          extensions: ['json']
        }],
        defaultPath: 'chi-tasks-export.json'
      });

      if (filePath) {
        const exportData = {
          version: '1.0',
          exportDate: new Date().toISOString(),
          tasks: tasks
        };
        
        await writeTextFile(filePath, JSON.stringify(exportData, null, 2));
        console.log('Tasks exported successfully');
      }
    } catch (error) {
      console.error('Error exporting tasks:', error);
    }
  };

  const importTasks = async () => {
    try {
      const filePath = await open({
        filters: [{
          name: 'JSON Files',
          extensions: ['json']
        }],
        multiple: false
      });

      if (filePath && typeof filePath === 'string') {
        const fileContent = await readTextFile(filePath);
        const importData = JSON.parse(fileContent);
        
        if (importData.tasks && Array.isArray(importData.tasks)) {
          onImportTasks(importData.tasks);
          console.log('Tasks imported successfully');
        } else {
          throw new Error('Invalid file format');
        }
      }
    } catch (error) {
      console.error('Error importing tasks:', error);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={exportTasks}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Export Tasks
      </button>
      <button
        onClick={importTasks}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Import Tasks
      </button>
    </div>
  );
};