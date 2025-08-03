# Vici Subagents

This directory contains specialized AI agents that help optimize different aspects of the Vici task management application. Each agent has a specific focus area and can be invoked for targeted improvements.

## Available Agents

### 🚀 performance-optimizer.md
Focuses on application performance, including:
- Animation optimization
- Bundle size reduction
- Image optimization
- React performance
- Tailwind CSS optimization

### 🔍 seo-specialist.md
Handles search engine optimization:
- Meta tag management
- Structured data implementation
- Technical SEO improvements
- Content optimization for search
- Social media previews

### 🎨 ui-enhancer.md
Improves user interface and experience:
- Component architecture
- Animation and microinteractions
- Accessibility standards
- Responsive design
- Dark mode refinement

### ✍️ content-optimizer.md
Ensures authentic, engaging copy:
- Brand voice consistency
- Microcopy optimization
- Error and success messages
- CTA variations
- Avoiding AI-generated feel

### 🎯 landing-page-optimizer.md
Specifically optimizes the landing page:
- Performance enhancements
- SEO implementation
- Accessibility improvements
- Component extraction
- Conversion optimization

## How to Use These Agents

1. **Automatic Delegation**: Claude Code will automatically use the appropriate sub-agent based on the task context.

2. **Explicit Invocation**: You can directly request a specific sub-agent:
   ```
   "Use the performance-optimizer sub-agent to analyze bundle sizes"
   ```

3. **Agent Chaining**: Multiple agents can work together on complex tasks:
   ```
   "First use seo-specialist to add meta tags, then use landing-page-optimizer to improve performance"
   ```

## Agent Structure

Each agent follows this structure:
- **YAML Frontmatter**: Contains name, description, and tools
- **System Prompt**: Detailed instructions for the agent's behavior
- **Purpose**: Clear statement of the agent's role
- **Core Responsibilities**: Specific areas of focus
- **Implementation Guidelines**: How to apply improvements
- **Templates/Examples**: Reusable code snippets
- **Checklists**: Validation steps

## Best Practices

1. **Maintain Consistency**: Agents should work in harmony, not conflict
2. **Preserve Personality**: Keep Vici's unique voice and feel
3. **Test Changes**: Verify improvements don't break functionality
4. **Document Updates**: Record significant changes made by agents
5. **Measure Impact**: Use metrics to validate improvements

## Adding New Agents

To create a new agent:
1. Create a new `.md` file in this directory
2. Add YAML frontmatter with:
   - `name`: lowercase-hyphenated identifier
   - `description`: brief purpose statement
   - `tools`: list of required tools (optional, inherits all if omitted)
3. Write a detailed system prompt
4. Define clear responsibilities and boundaries
5. Include practical examples and templates
6. Test the agent's effectiveness

## Integration with Claude

These agents are designed to work with Claude Code and can be referenced during development sessions. They provide specialized knowledge and best practices for their respective domains.