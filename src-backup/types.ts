export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'inprogress' | 'completed' | 'paused' | 'cancelled';
  category: string;
  estimated_time: number;
  actual_time?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface AIInsight {
  id: string;
  message: string;
  insight_type: 'ProductivityTip' | 'TaskPrioritization' | 'TimeManagement' | 'PatternRecognition' | 'Accountability';
  confidence: number;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  notification_type: 'Accountability' | 'TaskReminder' | 'Deadline' | 'Achievement' | 'Communication' | 'Insight';
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export interface CommunicationActivity {
  service: string;
  message_count: number;
  unread_count: number;
  last_activity?: string;
  mentions: number;
  keywords_detected: string[];
}

export interface ProductivityStats {
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  average_completion_time?: number;
  most_productive_hours: number[];
  common_categories: string[];
  weekly_progress: any[];
}