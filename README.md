# GitHub User Search

A React application that allows users to search for GitHub users and view their repositories. Built with React, TypeScript, and modern web technologies.

## Features

- Search for GitHub users with similar usernames (up to 5 results)
- View detailed repository information for selected users
- Responsive design with modern UI
- Real-time search feedback
- Error handling and loading states
- Keyboard navigation support

## Technologies Used

- React 18
- TypeScriptcd 
- Vite
- React Query (TanStack Query)
- Chakra UI
- Axios
- GitHub REST API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- GitHub Personal Access Token (optional, but recommended)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd github-user-search
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your GitHub token (optional but recommended to avoid rate limits):
   ```
   VITE_GITHUB_TOKEN=your_github_token_here
   ```
   - You can create a token at https://github.com/settings/tokens
   - No additional scopes are required, just public access

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

### Deployment

The application is configured for automatic deployment to GitHub Pages. To deploy:

1. Create a new repository on GitHub
2. Push your code to the repository
3. Go to repository Settings > Pages
4. Set the source to "GitHub Actions"
5. Push to the main branch to trigger deployment

The GitHub Action will automatically build and deploy your application to GitHub Pages.

## Usage

1. Enter a username in the search field (minimum 3 characters)
2. The application will display up to 5 users with similar usernames
3. Click on a user to view their repositories
4. Use keyboard navigation (arrow keys and enter) to interact with the interface

## Features

- Real-time search with debouncing
- Loading states for better UX
- Error handling for API failures
- Responsive design for mobile and desktop
- Keyboard navigation support
- Clean and modern UI using Chakra UI
- Efficient data fetching and caching with React Query

## Troubleshooting

### API Rate Limits
- Without authentication, GitHub API has a limit of 60 requests per hour
- With a GitHub token, this increases to 5,000 requests per hour
- If you hit the rate limit, the app will tell you when you can try again
- Add a GitHub token to your `.env` file to increase the limit

### Common Issues
- If search fails, ensure you've entered at least 3 characters
- If repository loading fails, check your internet connection
- Rate limit errors will show when you can try again
- For other issues, check the browser console for detailed error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.
