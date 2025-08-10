# Contributing to DevConnect

First off, thank you for considering contributing to DevConnect! It's people like you that make DevConnect such a great tool for the developer community.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/devconnect.git
   cd devconnect
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

6. **Make your changes and commit**
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

7. **Push to your fork and submit a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

- Use ES6+ features
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns
- Use Prettier for formatting

### React Component Guidelines

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript when possible
- Follow the existing folder structure
- Add PropTypes or TypeScript interfaces

## Project Structure

```
devconnect/
├── client/                 # React frontend
├── server/                 # Express backend
├── docs/                   # Documentation
└── scripts/               # Build scripts
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Include both unit and integration tests where appropriate

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainers directly.

Thank you for contributing! 🚀