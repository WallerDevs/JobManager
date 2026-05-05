# JobManager

A lightweight web-based job management application for tracking and organizing job listings, tasks, and workflows.

## Overview

JobManager is a simple, browser-based tool that helps teams and individuals manage job-related tasks in one place. It provides a clean interface for creating, tracking, and resolving jobs from start to finish. 
It supports both private users and companies throughout the job application journey.

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

## Project Vision

The goal is to create one central place where all functionality and data related to job applications can live. Users should be able to:

- import, retrieve, or create job applications
- work on and improve applications over time
- send applications to companies
- track progress through statuses and updates
- add comments and keep a clear process history
- analyze past application activity to gain insights for future job searches

## Core Capabilities for Private Users

Private users should be able to manage all relevant career documents and tailor communication for each opportunity:

- create and maintain CVs
- create and maintain personal letters
- customize what is sent to different companies
- keep a structured overview of all submitted applications

## Company-Focused Opportunities

Jobmanager is also intended to support companies, for example in situations where staff are being laid off and need structured help finding new jobs. This opens opportunities for company services that connect people with tools, guidance, and follow-up.

## Future Direction

We see broad opportunities to evolve Jobmanager with:

- integrations with external systems and data sources
- AI-powered features for smarter usability and better user outcomes
- potential future clients beyond web, such as mobile apps

## Intended Outcome

The outcome we want to accomplish is a smart, practical, and scalable service where individuals and companies can collaborate around job transition processes, with better structure, better visibility, and better results.

## MVP Scope

The MVP should focus on the core user value: organizing and executing the job application process from one place in the browser.

### In Scope (MVP)

- user account creation and secure login
- create, edit, and archive job applications
- track each application with clear statuses (for example: draft, sent, interview, rejected, offer)
- comments and timeline history per application
- CV and personal letter management
- basic customization of CV/personal letter per company application
- simple dashboard with application counts and status overview

### Out of Scope (MVP)

- advanced analytics and predictive insights
- deep external integrations with third-party systems
- full company portal and enterprise workflows
- mobile apps (native iOS/Android)
- advanced AI automation features

### MVP Success Criteria

- users can manage their full application lifecycle in one place
- users can tailor documents for different companies with low friction
- users can understand current status and history for each application quickly
- the platform is stable and usable in modern web browsers

## Phase 2 Roadmap

After validating the MVP, Phase 2 should focus on expanding intelligence, integrations, and company value.

### Phase 2 Priorities

- **Advanced analytics:** trend reporting, conversion funnels, and outcome insights to improve future applications
- **Integrations:** import/export and sync with selected external systems (for example job boards, HR systems, document providers)
- **AI capabilities:** assisted writing, smart suggestions, document quality checks, and workflow recommendations
- **Company services:** initial company portal features to support outplacement and structured employee transition programs
- **Scalability and collaboration:** stronger multi-user workflows, permissions, and auditability for company use cases

### Potential Milestones

- **Milestone 1:** analytics foundation and first external integration
- **Milestone 2:** AI-assisted document and application workflows
- **Milestone 3:** company-facing beta for transition support
- **Milestone 4:** expanded integrations and operational hardening

## Product Principles

These principles should guide product and technical decisions across MVP and later phases.

- **User-first value:** prioritize features that clearly reduce friction in real job-seeking workflows.
- **Privacy and trust by default:** protect personal career data with strong access control, clear consent, and transparent data handling.
- **Ownership and control:** users should always be able to view, edit, export, and manage their own documents and application history.
- **Explainable AI:** AI assistance should be practical, transparent, and easy to review before users act on recommendations.
- **Interoperability:** design for integrations from the start using clean APIs and portable data models.
- **Progressive delivery:** release in small validated steps, measure outcomes, and iterate based on real user behavior.
