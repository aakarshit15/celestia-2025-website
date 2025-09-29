# Celestia 2025 Website

This repository contains the code for the Celestia 2025 website with client and server components.

## Getting Started

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will be available at `http://localhost:5173` (or the port shown in your terminal).

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will be running at `http://localhost:3000` (default port).

## Development Workflow

### Initial Setup (First time only)

You have two options for setting up your development environment:

#### Option 1: Fork and Clone

1. Fork the repository:
   - Click the "Fork" button at the top right of this repository
   - This will create a copy of the repository in your GitHub account

2. Clone your forked repository:
```bash
git clone https://github.com/YOUR-USERNAME/celestia-2025-website.git
cd celestia-2025-website
```

3. Add the upstream remote to keep your fork updated:
```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/celestia-2025-website.git
```

#### Option 2: Direct Clone and Branch

1. Clone the main repository directly:
```bash
git clone https://github.com/ORIGINAL-OWNER/celestia-2025-website.git
cd celestia-2025-website
```

2. Create your development branch:
```bash
git checkout -b dev/YOUR-GITHUB-ID
git pull origin main
```
####Note: If your are choosing option 2, then you will work in your branch only and you will never switch to main branch

### Before Making Changes

Always ensure your code is up to date before making any changes:

#### If you're working with a fork (Option 1):

1. Fetch and merge changes from the upstream main branch:
```bash
git pull upstream main
```

#### If you're working with a dev branch (Option 2):

1. Pull the latest changes from the main branch of global repo to your banch of local repo:
```bash
git checkout dev/YOUR-GITHUB-ID  # if not in your branch
git pull origin main
```

### Committing Changes

1. Check the status of your changes:
```bash
git status
```

2. Add your changes:
```bash
git add .
```

3. Commit your changes with a descriptive message:
```bash
git commit -m "<commit-message>"
```

4. Push your changes to your fork (If Option 1):
```bash
git push origin main
```

4. Push your changes to your branch (If Option 12):
```bash
git push origin dev/<your-github-id>
```

#### Creating the PR on GitHub

1. Go to the original repository on GitHub

2. Click on "Pull Requests" and then "New Pull Request"

3. Choose the appropriate comparison:

   If working with a fork (Option 1):
   - Click "compare across forks"
   - Base repository: original repository
   - Base branch: main
   - Head repository: your fork
   - Compare branch: your feature branch

   If working with a dev branch (Option 2):
   - Base branch: main
   - Compare branch: dev/YOUR-GITHUB-ID

4. Click "Create Pull Request"

5. Add a descriptive title and description:
   - What changes were made
   - Why the changes were made
   - Any special instructions or notes

6. Click "Create Pull Request"

### PR Best Practices

1. Keep PRs focused and small
2. Write clear descriptions
3. Include screenshots for UI changes
4. Reference any related issues
5. Respond to review comments promptly
6. Keep your PR up to date with the main branch

### Merge Conflicts

1. Try to solve on your own, if nahi ho raha then approach any mentor.