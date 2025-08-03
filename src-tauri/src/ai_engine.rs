use anyhow::Result;
use chrono::Timelike;
use log::{error, info, warn};
use reqwest::Client;
use serde_json::json;
use std::env;

use crate::models::Task;

pub struct AIEngine {
    client: Client,
    openai_api_key: Option<String>,
}

impl Default for AIEngine {
    fn default() -> Self {
        Self::new()
    }
}

impl AIEngine {
    pub fn new() -> Self {
        let openai_api_key = env::var("OPENAI_API_KEY").ok();

        if openai_api_key.is_none() {
            warn!("OpenAI API key not found. AI features will use fallback responses.");
        }

        Self {
            client: Client::new(),
            openai_api_key,
        }
    }

    pub async fn generate_insights(&self, tasks: &[Task]) -> Result<Vec<String>> {
        if let Some(api_key) = &self.openai_api_key {
            match self.generate_openai_insights(tasks, api_key).await {
                Ok(insights) => return Ok(insights),
                Err(e) => {
                    error!("OpenAI insights generation failed: {}", e);
                    // Fall back to rule-based insights
                }
            }
        }

        Ok(self.generate_fallback_insights(tasks))
    }

    async fn generate_openai_insights(&self, tasks: &[Task], api_key: &str) -> Result<Vec<String>> {
        let completed_tasks = tasks
            .iter()
            .filter(|t| matches!(t.status, crate::models::TaskStatus::Completed))
            .count();
        let total_tasks = tasks.len();
        let high_priority_tasks = tasks
            .iter()
            .filter(|t| {
                matches!(
                    t.priority,
                    crate::models::Priority::High | crate::models::Priority::Critical
                ) && !matches!(t.status, crate::models::TaskStatus::Completed)
            })
            .count();
        let overdue_tasks = tasks.iter().filter(|t| t.is_overdue()).count();

        let prompt = format!(
            "Analyze this productivity data and provide 3 brief, actionable insights (each under 100 characters):
            
            Tasks Status:
            - Total tasks: {}
            - Completed: {}
            - High priority pending: {}
            - Overdue: {}
            
            Focus on task completion strategies, time management, and motivation. Keep responses concise and encouraging.",
            total_tasks, completed_tasks, high_priority_tasks, overdue_tasks
        );

        let request_body = json!({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an AI productivity coach that provides brief, actionable insights. Each insight should be under 100 characters and actionable."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 300,
            "temperature": 0.7
        });

        let response = self
            .client
            .post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", api_key))
            .header("Content-Type", "application/json")
            .json(&request_body)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(anyhow::anyhow!("OpenAI API error: {}", error_text));
        }

        let response_json: serde_json::Value = response.json().await?;

        let content = response_json["choices"][0]["message"]["content"]
            .as_str()
            .unwrap_or("")
            .trim();

        let insights: Vec<String> = content
            .split('\n')
            .filter(|line| !line.trim().is_empty())
            .map(|line| line.trim().to_string())
            .take(3)
            .collect();

        info!("Generated {} AI insights", insights.len());
        Ok(insights)
    }
    fn generate_fallback_insights(&self, tasks: &[Task]) -> Vec<String> {
        let mut insights = Vec::new();

        let completed_tasks = tasks
            .iter()
            .filter(|t| matches!(t.status, crate::models::TaskStatus::Completed))
            .count();
        let total_tasks = tasks.len();
        let high_priority_tasks = tasks
            .iter()
            .filter(|t| {
                matches!(
                    t.priority,
                    crate::models::Priority::High | crate::models::Priority::Critical
                ) && !matches!(t.status, crate::models::TaskStatus::Completed)
            })
            .count();
        let overdue_tasks = tasks.iter().filter(|t| t.is_overdue()).count();

        if total_tasks == 0 {
            insights.push(
                "Start by adding your daily tasks to track progress effectively.".to_string(),
            );
        } else {
            let completion_rate = (completed_tasks as f32 / total_tasks as f32) * 100.0;

            if completion_rate >= 80.0 {
                insights.push(format!(
                    "Excellent progress! You've completed {:.0}% of your tasks. 🎉",
                    completion_rate
                ));
            } else if completion_rate >= 50.0 {
                insights.push(format!(
                    "Good momentum! Focus on completing the remaining {} tasks.",
                    total_tasks - completed_tasks
                ));
            } else if high_priority_tasks > 0 {
                insights.push(format!(
                    "{} high-priority tasks need attention. Consider tackling these first.",
                    high_priority_tasks
                ));
            } else {
                insights.push(
                    "Break down large tasks into smaller, manageable chunks for better progress."
                        .to_string(),
                );
            }
        }

        if overdue_tasks > 0 {
            insights.push(format!(
                "{} tasks are overdue. Prioritize these to get back on track.",
                overdue_tasks
            ));
        }

        // Time-based insights
        let current_hour = chrono::Utc::now().hour();
        match current_hour {
            9..=11 => insights.push(
                "Peak productivity hours: 9-11 AM. Use this time for challenging tasks."
                    .to_string(),
            ),
            14..=16 => insights.push(
                "Post-lunch dip is normal. Consider lighter tasks or a short break.".to_string(),
            ),
            17..=19 => insights.push(
                "End of workday approaching. Review what you've accomplished today.".to_string(),
            ),
            _ => {}
        }

        // Ensure we have at least one insight
        if insights.is_empty() {
            insights.push(
                "Stay focused on your goals. Small consistent progress leads to big results!"
                    .to_string(),
            );
        }

        insights.into_iter().take(3).collect()
    }

    pub async fn generate_accountability_message(&self, tasks: &[Task]) -> Result<String> {
        let completed_tasks = tasks
            .iter()
            .filter(|t| matches!(t.status, crate::models::TaskStatus::Completed))
            .count();
        let pending_tasks = tasks.len() - completed_tasks;

        if let Some(api_key) = &self.openai_api_key {
            match self
                .generate_openai_accountability_message(completed_tasks, pending_tasks, api_key)
                .await
            {
                Ok(message) => return Ok(message),
                Err(e) => {
                    error!("OpenAI accountability message generation failed: {}", e);
                    // Fall back to predefined messages
                }
            }
        }

        Ok(self.generate_fallback_accountability_message(completed_tasks, pending_tasks))
    }

    async fn generate_openai_accountability_message(
        &self,
        completed: usize,
        pending: usize,
        api_key: &str,
    ) -> Result<String> {
        let prompt = format!(
            "Generate a brief, encouraging accountability check-in message (under 150 characters) based on:
            - {} completed tasks
            - {} pending tasks
            - Current time: {}
            
            Keep it motivating, specific, and actionable.",
            completed, pending, chrono::Utc::now().format("%H:%M")
        );

        let request_body = json!({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a supportive productivity coach. Create brief, encouraging check-in messages under 150 characters."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 100,
            "temperature": 0.8
        });

        let response = self
            .client
            .post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", api_key))
            .header("Content-Type", "application/json")
            .json(&request_body)
            .send()
            .await?;

        if !response.status().is_success() {
            let error_text = response.text().await?;
            return Err(anyhow::anyhow!("OpenAI API error: {}", error_text));
        }

        let response_json: serde_json::Value = response.json().await?;
        let message = response_json["choices"][0]["message"]["content"]
            .as_str()
            .unwrap_or("")
            .trim()
            .to_string();

        Ok(message)
    }

    fn generate_fallback_accountability_message(&self, completed: usize, pending: usize) -> String {
        let messages = [
            format!("Great job completing {} tasks! {} more to go - you've got this! 💪", completed, pending),
            format!("Time check! You've finished {} tasks. Which one will you tackle next?", completed),
            format!("Progress update: {}/{} tasks done. Keep up the momentum! 🚀", completed, completed + pending),
            "Accountability moment: Focus on your next priority task. You're making solid progress! ✨".to_string(),
            format!("You're {} tasks closer to your goals! Stay focused and keep pushing forward.", completed),
        ];

        let index = chrono::Utc::now().timestamp() as usize % messages.len();
        messages[index].clone()
    }

    pub async fn analyze_productivity_patterns(&self, tasks: &[Task]) -> Result<Vec<String>> {
        // Analyze completion times, categories, priorities
        let mut patterns = Vec::new();

        // Most common categories
        let mut category_counts = std::collections::HashMap::new();
        for task in tasks {
            *category_counts.entry(task.category.clone()).or_insert(0) += 1;
        }

        if let Some((most_common_category, count)) =
            category_counts.iter().max_by_key(|(_, &count)| count)
        {
            patterns.push(format!(
                "Most frequent category: {} ({} tasks)",
                most_common_category, count
            ));
        }

        // Average completion time for completed tasks
        let completed_with_time: Vec<_> = tasks
            .iter()
            .filter(|t| {
                matches!(t.status, crate::models::TaskStatus::Completed) && t.actual_time.is_some()
            })
            .collect();

        if !completed_with_time.is_empty() {
            let avg_time: f32 = completed_with_time
                .iter()
                .map(|t| t.actual_time.unwrap() as f32)
                .sum::<f32>()
                / completed_with_time.len() as f32;

            patterns.push(format!("Average completion time: {:.1} minutes", avg_time));
        }

        // Priority distribution
        let high_priority_count = tasks
            .iter()
            .filter(|t| {
                matches!(
                    t.priority,
                    crate::models::Priority::High | crate::models::Priority::Critical
                )
            })
            .count();

        if high_priority_count > 0 {
            let high_priority_percentage =
                (high_priority_count as f32 / tasks.len() as f32) * 100.0;
            patterns.push(format!(
                "{:.0}% of tasks are high priority",
                high_priority_percentage
            ));
        }

        Ok(patterns)
    }
}
