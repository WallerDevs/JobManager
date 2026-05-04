# JobManager

A lightweight web-based job management application for tracking and organizing job listings, tasks, and workflows.

## Overview

JobManager is a simple, browser-based tool that helps teams and individuals manage job-related tasks in one place. It provides a clean interface for creating, tracking, and resolving jobs from start to finish.

## Features

- Create and track job listings or tasks
- Clean, responsive UI powered by [Primer CSS](https://primer.style/css/)
- Automated HTML validation via GitHub Actions
- Auto-assignment of issues and pull requests to maintainers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, [Primer CSS](https://primer.style/css/) v17 |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for installing dependencies)
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/WallerDevs/JobManager.git
   cd JobManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Open the app**

   Open `index.html` directly in your browser, or serve it with any static file server:
   ```bash
   npx serve .
   ```

## GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **Proof HTML** | Push / Manual | Validates HTML files for correctness |
| **Auto Assign** | Issue / PR opened | Automatically assigns new issues and PRs to the maintainer |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).
