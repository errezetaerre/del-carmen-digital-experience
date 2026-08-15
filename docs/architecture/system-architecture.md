# System Architecture

Version: 1.0

Document ID:
DOC-SA

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Technical

Authority Level:
Highest

Status:
⚪ Draft

Owner:
Del Carmen Digital Experience

Last Updated:
2026-07-08

---

# Purpose

This document defines the high-level architecture of Del Carmen Digital Experience.

It describes how the platform is organized from a software engineering perspective, establishes the responsibilities of each layer, and provides the structural foundation for every future module.

This document complements `folder-architecture.md`.

While Folder Architecture defines where files live, System Architecture defines how the entire system works.

---

# Table of Contents

SA-01 Architecture Principles

SA-02 Technology Stack

SA-03 High-Level System

SA-04 Application Layers

SA-05 Domain Architecture

SA-06 Request Flow

SA-07 Data Flow

SA-08 Authentication

SA-09 Database Architecture

SA-10 File Storage

SA-11 CMS Strategy

SA-12 Marketplace Architecture

SA-13 Future Modules

SA-14 Deployment

SA-15 Scalability

SA-16 Security

SA-17 Observability

SA-18 Final Principle

---

# SA-01 Architecture Principles

Status:
⚪ Draft

The platform follows these principles:

• Separation of Concerns

• Single Responsibility

• Modular Design

• Clean Architecture

• MVC Pattern

• Reusable Components

• Performance First

• Accessibility by Default

• Progressive Enhancement

• Scalable by Design

The architecture must remain understandable after many years.

---

# SA-02 Technology Stack

Status:
⚪ Draft

Frontend Framework

• Next.js
• React
• TypeScript
• Tailwind CSS

Application Runtime

• Node.js

Backend Architecture

• Next.js Server Components
• Server Actions
• API Routes when required

Database

• PostgreSQL

ORM

• Prisma

Authentication

• NextAuth (Auth.js)

Storage

• Cloudinary (artworks)

Deployment

• Vercel

Version Control

• GitHub

---

# SA-03 High-Level System

Status:
⚪ Draft

```text
Visitor
        │
        ▼
Next.js Application
        │
        ▼
Application Layer
        │
        ▼
Business Logic
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL Database
```

Every request follows this structure.

The UI never communicates directly with the database.

---

# SA-04 Application Layers

Status:
⚪ Draft

Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

Persistence Layer

Each layer has a single responsibility.

Dependencies always point inward.

The architecture follows Clean Architecture principles adapted to Next.js.

Framework dependencies must never control business decisions.

The Domain Layer remains independent from UI and infrastructure.

---

# SA-05 Domain Architecture

Status:
⚪ Draft

The platform is organized by domains.

Examples:

Artwork

Artist

Collection

Journal

Marketplace

Orders

Collectors

Authentication

Settings

Each domain owns:

Components

Services

Controllers

Models

Validation

Types

Hooks

Artwork is the central domain entity.

Unlike traditional ecommerce systems, artworks contain:

• Artistic metadata
• Story
• Inspiration
• Creation process
• Authentication
• Ownership history
• Exhibition history
• Media assets
---

# SA-06 Request Flow

Status:
⚪ Draft

Browser

↓

Page

↓

Component

↓

Action

↓

Service

↓

Repository

↓

Prisma

↓

Database

No component accesses the database directly.

---

# SA-07 Data Flow

Status:
⚪ Draft

Database

↓

Repository

↓

Service

↓

Server Component

↓

Client Component

↓

Visitor

Data always flows in one direction.

---

# SA-08 Authentication

Status:
⚪ Draft

Public Area

Visitors

Collectors

Protected Area

Administrator

Future:

Artist Dashboard

Collector Dashboard

Academy

---

# SA-09 Database Architecture

Status:
⚪ Draft

Core entities

Artworks

Collections

Categories

Journal

Users

Collectors

Orders

Messages

Settings

Media

Art Domain

Artwork
Collection
Exhibition
JournalEntry
ArtistStatement

Commerce Domain

Product
Order
Payment
Transaction
Invoice

Identity Domain

User
Role
CollectorProfile

The database must be extensible.

---

# SA-10 File Storage

Status:
⚪ Draft

Images

Cloudinary

Documents

Local / Future S3

Generated Assets

CDN

Original artwork files are never modified.

Artwork preservation rule:

Original high-resolution files must never be publicly exposed.

Public images are optimized derivatives generated from protected originals.

---

# SA-11 CMS Strategy

Status:
⚪ Draft

Version 1

Custom Admin Panel

Future

Headless CMS if needed

The CMS must remain invisible to visitors.

---

# SA-12 Marketplace Architecture

Status:
⚪ Draft

Artwork

↓

Cart

↓

Checkout

↓

Payment

↓

Order

↓

Collector

↓

Invoice

Marketplace remains independent from the gallery experience.

The marketplace is commerce infrastructure, not the identity of the platform.

The emotional experience happens before the transaction.

---

# SA-13 Future Modules

Status:
⚪ Draft

Virtual Museum

Online Academy

Community

Collector Circle

Immersive Experiences

Digital Exhibitions

Artist Residency

Licensing

Archive

Each future module plugs into the existing architecture.

No redesign should be necessary.

---

# SA-14 Deployment

Status:
⚪ Draft

Development

↓

GitHub

↓

Vercel Preview

↓

Testing

↓

Production

CI/CD must remain automatic.

---

# SA-15 Scalability

Status:
⚪ Draft

Every module must be replaceable.

Every component reusable.

Every service independent.

Future growth should require extension rather than rewriting.

---

# SA-16 Security

Status:
⚪ Draft

Authentication

Authorization

Environment Variables

Secure APIs

Input Validation

Rate Limiting

Database Protection

Image Optimization

Security is part of the architecture.

Not an afterthought.

---
# SA-17 Observability
Status:
⚪ Draft

The platform must provide visibility into:

• Errors
• Performance
• User behavior
• Server health
• Security events

Tools:

Future:
• Analytics
• Logging
• Monitoring
• Error Tracking
# SA-18 Final Principle

Status:
⚪ Reviewed

The technology should never become the experience.

Visitors should remember the artwork, not the software.

Technology exists only to protect, preserve and reveal beauty.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
