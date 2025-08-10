const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('OpenAI API key not found. AI features will be disabled.');
            this.client = null;
            return;
        }

        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        this.systemPrompts = {
            general: `You are a helpful AI assistant for developers. You provide clear, concise, and practical advice on programming, software development, and technology topics. Always be encouraging and supportive.`,

            coding: `You are an expert programming assistant. Help developers with code debugging, optimization, best practices, and explanations. Provide code examples when helpful and explain your reasoning.`,

            blog: `You are a content creation assistant for developer blogs. Help generate engaging blog post ideas, titles, outlines, and content suggestions. Focus on topics that would be valuable to the developer community.`,

            project: `You are a project planning assistant for developers. Help with project ideas, architecture decisions, technology stack recommendations, and development roadmaps. Consider scalability, maintainability, and best practices.`,

            career: `You are a career advisor for software developers. Provide guidance on career growth, skill development, job searching, interview preparation, and professional development in the tech industry.`,

            resources: `You are a learning resource curator for developers. Recommend high-quality learning materials, courses, books, tutorials, and practice platforms based on the user's needs and skill level.`
        };
    }

    async generateResponse(message, category = 'general', context = {}) {
        if (!this.client) {
            return this.getFallbackResponse(message, category);
        }

        try {
            const systemPrompt = this.systemPrompts[category] || this.systemPrompts.general;

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ];

            // Add context if provided
            if (context.previousMessages && context.previousMessages.length > 0) {
                const contextMessages = context.previousMessages.slice(-5).map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }));
                messages.splice(1, 0, ...contextMessages);
            }

            const completion = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages,
                max_tokens: 500,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI API error:', error);
            return this.getFallbackResponse(message, category);
        }
    }

    async generateBlogTitle(content, tags = []) {
        if (!this.client) {
            return this.getFallbackBlogTitle(content, tags);
        }

        try {
            const prompt = `Generate 3 engaging blog post titles for the following content. Consider these tags: ${tags.join(', ')}

Content: ${content.substring(0, 500)}...

Requirements:
- Titles should be catchy and SEO-friendly
- Include relevant keywords
- Appeal to developers
- Be between 40-60 characters

Format as a numbered list.`;

            const completion = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 200,
                temperature: 0.8,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI API error:', error);
            return this.getFallbackBlogTitle(content, tags);
        }
    }

    async generateTags(content, maxTags = 5) {
        if (!this.client) {
            return this.getFallbackTags(content);
        }

        try {
            const prompt = `Analyze the following content and suggest ${maxTags} relevant tags for a developer blog post. Return only the tags, separated by commas.

Content: ${content.substring(0, 1000)}...`;

            const completion = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100,
                temperature: 0.5,
            });

            const tags = completion.choices[0].message.content
                .trim()
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
                .slice(0, maxTags);

            return tags;
        } catch (error) {
            console.error('OpenAI API error:', error);
            return this.getFallbackTags(content);
        }
    }

    async generateCodeExplanation(code, language = 'javascript') {
        if (!this.client) {
            return `This is ${language} code. I'd be happy to explain it, but AI features are currently unavailable.`;
        }

        try {
            const prompt = `Explain the following ${language} code in simple terms. Break down what each part does and mention any best practices or potential improvements.

\`\`\`${language}
${code}
\`\`\``;

            const completion = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 400,
                temperature: 0.3,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI API error:', error);
            return `I'd be happy to explain this ${language} code, but I'm having trouble processing it right now. Please try again later.`;
        }
    }

    async generateProjectIdea(skills, interests, difficulty = 'intermediate') {
        if (!this.client) {
            return this.getFallbackProjectIdea(skills, interests, difficulty);
        }

        try {
            const prompt = `Generate a ${difficulty} level project idea for a developer with these skills: ${skills.join(', ')} and interests in: ${interests.join(', ')}.

Include:
- Project title and brief description
- Key features to implement
- Technologies to use
- Estimated time to complete
- Learning outcomes

Format as a structured response.`;

            const completion = await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 400,
                temperature: 0.8,
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI API error:', error);
            return this.getFallbackProjectIdea(skills, interests, difficulty);
        }
    }

    // Fallback responses when OpenAI is unavailable
    getFallbackResponse(message, category) {
        const fallbacks = {
            general: "I'm here to help with your development questions! While AI features are currently limited, I can still provide guidance on programming topics, project ideas, and career advice.",

            coding: "I'd love to help with your code! Please share your specific question or code snippet, and I'll do my best to provide guidance on debugging, optimization, or best practices.",

            blog: "For blog content, consider writing about your recent projects, lessons learned, tutorials on technologies you've mastered, or your journey as a developer. What specific topic interests you?",

            project: "Great project ideas include: building a task manager, creating a weather app with API integration, developing a portfolio website, or contributing to open source projects. What's your skill level and interests?",

            career: "For career growth, focus on: building a strong portfolio, contributing to open source, networking with other developers, continuous learning, and practicing coding interviews. What specific area would you like advice on?",

            resources: "Excellent learning resources include: freeCodeCamp, MDN Web Docs, official documentation, YouTube tutorials, coding bootcamps, and hands-on projects. What technology are you looking to learn?"
        };

        return fallbacks[category] || fallbacks.general;
    }

    getFallbackBlogTitle(content, tags) {
        const commonTitles = [
            "A Developer's Guide to [Topic]",
            "Building Better [Technology] Applications",
            "Lessons Learned: [Experience]",
            "Getting Started with [Technology]",
            "Best Practices for [Topic]"
        ];

        return commonTitles.join('\n');
    }

    getFallbackTags(content) {
        // Extract potential tags from content
        const commonTags = ['javascript', 'react', 'nodejs', 'programming', 'webdev', 'tutorial', 'beginners'];
        return commonTags.slice(0, 5);
    }

    getFallbackProjectIdea(skills, interests, difficulty) {
        return `**Project Idea: Personal Dashboard**

Build a customizable dashboard that aggregates information from various APIs.

**Key Features:**
- Weather widget
- News feed
- GitHub activity tracker
- Task/todo manager
- Customizable layout

**Technologies:** ${skills.slice(0, 3).join(', ')}
**Difficulty:** ${difficulty}
**Time:** 2-3 weeks
**Learning:** API integration, responsive design, state management`;
    }
}

module.exports = new OpenAIService();