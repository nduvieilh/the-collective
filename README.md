# The Collective - Multi-Bot Chatroom

A React-based multi-bot chatroom application where humans can interact with multiple AI personalities powered by AWS Bedrock and Anthropic Claude models.

## Features

- **Multi-Bot Conversations**: Chat with multiple AI bots simultaneously, each with unique personalities
- **Customizable Bot Personas**: Create and configure bot personalities, system prompts, and behaviors
- **Room Settings**: Customize the chatroom environment and context that influences bot responses
- **AWS Bedrock Integration**: Powered by Anthropic Claude Sonnet 4 via AWS Bedrock
- **Real-time Chat Interface**: Modern, responsive chat UI with message history
- **TypeScript**: Fully typed for better development experience
- **Testing**: Comprehensive test suite with Vitest and React Testing Library
- **Tailwind CSS**: Beautiful, responsive styling

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Service**: AWS Bedrock (Anthropic Claude)
- **Testing**: Vitest + React Testing Library + jsdom
- **State Management**: React hooks (useState, useCallback)
- **Build Tool**: Vite

## Prerequisites

- Node.js 20.5.1 or higher
- AWS Account with Bedrock access
- AWS credentials with Bedrock permissions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nduvieilh/the-collective.git
cd the-collective
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables template:
```bash
cp .env.example .env.local
```

4. Configure your AWS credentials (optional - can also be done via UI):
```bash
# Edit .env.local with your AWS credentials
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
VITE_BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

## Usage

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests once:
```bash
npm run test:run
```

## Configuration

### AWS Bedrock Setup

1. **AWS Account**: Ensure you have an AWS account with Bedrock access
2. **Model Access**: Request access to Anthropic Claude models in AWS Bedrock console
3. **Credentials**: Create IAM user with Bedrock permissions or use existing credentials
4. **Region**: Ensure Bedrock is available in your selected region

### Required AWS Permissions

Your AWS credentials need the following permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": [
                "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
            ]
        }
    ]
}
```

## Application Structure

```
src/
├── components/          # React components
│   ├── BedrockConfig.tsx    # AWS Bedrock configuration
│   ├── BotConfig.tsx        # Bot management interface
│   ├── ChatMessages.tsx     # Message display component
│   ├── Message.tsx          # Individual message component
│   ├── MessageInput.tsx     # Message input form
│   ├── RoomSettings.tsx     # Room configuration
│   └── __tests__/           # Component tests
├── hooks/               # Custom React hooks
│   └── useChat.ts           # Chat state management
├── services/            # External service integrations
│   └── bedrockService.ts    # AWS Bedrock API client
├── types/               # TypeScript type definitions
│   └── index.ts             # Application types
├── test/                # Test configuration
│   └── setup.ts             # Test setup file
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Key Features Explained

### Bot Personalities

Each bot has:
- **Name**: Display name in the chat
- **Personality**: Brief description of the bot's character
- **System Prompt**: Detailed instructions for the AI model
- **Active Status**: Whether the bot participates in conversations

### Room Settings

Configure the chatroom environment:
- **Room Name & Description**: Basic room information
- **Setting/Theme**: The environment context (e.g., "Medieval tavern", "Corporate meeting")
- **Room Context**: Additional context that influences bot behavior
- **Max Bots**: Maximum number of bots allowed in the room

### Conversation Flow

1. User sends a message
2. All active bots receive the full conversation history
3. Each bot generates a response based on their personality and the room context
4. Bot responses are displayed in the chat

## Customization

### Adding New Bot Presets

You can add new bot personalities by modifying the `defaultBots` array in `src/hooks/useChat.ts`.

### Room Themes

Add new room presets in the `RoomSettings` component quick settings section.

### Styling

The application uses Tailwind CSS. Customize the design by modifying the Tailwind classes in components or extending the `tailwind.config.js` file.

## Security Considerations

- AWS credentials are stored locally in browser localStorage
- Credentials are only sent to AWS Bedrock, never to external servers
- Use IAM users with minimal required permissions
- Consider using temporary credentials or AWS STS for enhanced security

## Troubleshooting

### Common Issues

1. **Bedrock Access Denied**: Ensure your AWS credentials have proper Bedrock permissions
2. **Model Not Available**: Check if the selected Claude model is available in your AWS region
3. **Network Errors**: Verify your internet connection and AWS service status
4. **Build Errors**: Ensure you're using Node.js 20.5.1 or higher

### Debug Mode

Enable debug logging by opening browser developer tools and checking the console for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite
- Powered by AWS Bedrock and Anthropic Claude
- UI components styled with Tailwind CSS
- Testing with Vitest and React Testing Library
