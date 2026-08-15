Version: 1.1

Document ID:
DOC-RS

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Architecture

Authority Level:
Highest

Status:
🟢 Approved

Owner:
Del Carmen Digital Experience

Last Updated:
2026-08-03

---

Repository Structure
Purpose
This document defines the official repository structure of Del Carmen Digital Experience.
Its purpose is to provide a stable, scalable and maintainable organization for the entire codebase.
The repository structure is considered part of the project's architecture and should remain stable throughout the life of the platform.
Business requirements may evolve.
Technologies may evolve.
The repository structure should change only under exceptional architectural decisions.
 
Architectural Principles
The repository is organized according to the following principles:
•	Business-oriented organization. 
•	Clear separation of responsibilities. 
•	High cohesion. 
•	Low coupling. 
•	Reusable shared resources. 
•	Progressive scalability. 
•	Simplicity before complexity. 
The architecture is designed to support future growth without requiring structural redesign.
 
Root Structure
del-carmen-digital-experience/

├── docs/
├── public/
├── src/
├── .env.local
├── .env.example
├── .gitignore
├── eslint.config.js
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
 
Source Structure
src/

├── app/
├── assets/
├── config/
├── domains/
├── services/
├── shared/
├── styles/ 
Responsibilities
app/
Contains the Next.js App Router.
Responsibilities:
•	layouts 
•	pages 
•	routing 
•	metadata 
•	global providers 
No business logic should live here.
 
domains/
Contains the business implementation.
Each domain owns its own components, services, hooks, schemas, types and internal logic.
Domains should remain isolated whenever possible.
No domain should directly depend on another unless explicitly defined by the Domain Model.
 
shared/

├── components/
├── hooks/
├── layout/
├── lib/
├── types/
├── ui/
└── utils/
Shared contains reusable building blocks that are independent from any business domain. Everything placed here should be reusable across multiple domains whenever possible.
Examples:
•	UI components 
•	Icons 
•	Typography 
•	Utilities 
•	Hooks 
•	Helpers 
•	Constants 
Everything inside shared must be framework-independent whenever possible.
 
infrastructure/
Contains external integrations.
Examples:
•	Database 
•	API clients 
•	Authentication 
•	Storage 
•	Email 
•	Analytics 
•	External services 
Business rules must never be implemented here.
 
styles/
Contains global styling resources.
Examples:
•	Global CSS 
•	Tailwind layers 
•	Design Tokens 
•	Typography configuration 
No component-specific styles belong here.
 
config/
Contains global application configuration.
Examples:
•	Environment configuration 
•	Feature flags 
•	Constants 
•	Runtime configuration 
 
types/
Contains global shared TypeScript types.
Domain-specific types belong inside their respective domain.
 
assets/
Contains source assets used during development and bundled with the application.
Examples:
•	SVG 
•	Logos
•	Icons 
•	textures
•	Local images 
•	Fonts 
•	Illustrations 
Public assets remain inside /public.
 services/
Contains services responsible for communication with external systems or application-level operations.
Examples:
•	API services 
•	CMS services 
•	Payment services 
•	Search services 
•	Email services 
Services should coordinate operations but should not contain business domain logic.

 
Folder	Responsibility
app	Next.js routing and composition
domains	Business implementation
shared	Reusable resources
services	Application services
config	Global configuration
assets	Source assets
styles	Global styles

 
Domain Strategy
The Domain Model (DOC-DM) defines the complete business universe.
The repository only implements the domains required by the current product version.
New domains will be introduced according to the official Roadmap.
No empty domain folders should be created in anticipation of future features.
 
Evolution Policy
The repository structure is considered stable.
Future evolution may include:
•	Adding new domains. 
•	Adding new shared resources. 
•	Adding infrastructure integrations. 
Structural reorganization should be avoided once implementation begins.
 
Repository Governance
Every new file added to the repository must have a clear architectural justification.
When in doubt:
•	Reuse existing structures. 
•	Prefer consistency over convenience. 
•	Avoid duplication. 
•	Preserve architectural simplicity. 
 
Documentation Structure
docs/

├── architecture/
├── components/
├── database/
├── identity/
├── pages/
├── project/
└── prompts/
Purpose
All project documentation is centralized under the docs/ directory.
This separation keeps implementation and documentation independent while maintaining a single source of truth for the project.
 
Final Statement
The repository structure exists to support the product, not to dictate it.
Del Carmen Digital Experience grows by extending its domains, not by reorganizing its foundation.

