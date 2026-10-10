Banking Risk & Customer Analytics Platform

A full-stack web application for monitoring banking transactions, identifying potentially suspicious activity, and visualizing transaction risk through an interactive dashboard.

Project Overview

The Banking Risk Platform helps users review transaction activity, filter transactions by risk level and payment channel, and analyze transaction patterns using visual dashboards.

The application uses an explainable, rule-based risk scoring engine. It is a demonstration project and does not detect confirmed financial fraud.

Key Features

Transaction Management: Create and retrieve banking transactions.

Risk Scoring: Assign risk scores and risk levels using predefined rules.

Transaction Search: Search transactions by transaction ID.

Advanced Filtering: Filter transactions by risk level and payment channel.

Analytics Dashboard: View transaction counts, total transaction value, suspicious transaction counts, and high-risk transaction counts.

Data Visualization: Display risk distribution and payment-channel analytics.

Input Validation: Reject invalid amounts and missing required fields.

Duplicate Prevention: Reject duplicate transaction IDs.

Database Integration: Store and retrieve transaction records using MongoDB.

Technology Stack

Layer

Technologies

Frontend

React, Vite, JavaScript

UI Components

Material UI (MUI)

Charts

Recharts

Backend

Python, FastAPI

Database

MongoDB Atlas, PyMongo

API Documentation

OpenAPI, Swagger UI

Validation

Pydantic

Development Tools

VS Code, Git, GitHub

Architecture

React Dashboard
      |
      | HTTP / REST API
      v
FastAPI Backend
      |
      +---- Transaction Routes
      |
      +---- Rule-Based Risk Engine
      |
      +---- Analytics Routes
      |
      v
MongoDB Atlas
      |
      v
Transaction Data & Analytics

Risk Scoring Logic

The current rule-based risk engine assigns points for selected transaction characteristics.

Rule

Risk Points

Transaction amount ≥ ₹1,00,000

+25

International transaction

+20

The total score is capped at 100.

Risk Score

Risk Level

0–29

Low

30–59

Medium

60–79

High

80–100

Critical

The application also returns reasons explaining why points were assigned. These rules are illustrative and are not a substitute for a bank's production fraud-detection systems.

API Endpoints

Method

Endpoint

Purpose

GET

/

API root

GET

/health

Health check

POST

/transactions

Create a transaction and calculate its risk

GET

/transactions

Retrieve transactions with filtering and pagination

GET

/transactions/{transaction_id}

Retrieve a transaction by ID

GET

/analytics/summary

Retrieve transaction and risk analytics

Interactive API documentation is available at /docs while the backend is running.

Getting Started

Prerequisites

Python 3.13 or a compatible Python version

Node.js and npm

A MongoDB Atlas database or compatible MongoDB instance

Git

1. Clone the Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd banking-risk-platform

Replace the placeholder with your actual GitHub repository URL.

2. Configure the Backend

Open a terminal in the project root:

cd backend
python -m venv venv

Activate the virtual environment on Windows:

.\venv\Scripts\Activate.ps1

Install the backend dependencies:

pip install fastapi uvicorn pymongo python-dotenv

Create a backend/.env file:

MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=banking_risk_db

Replace the connection-string placeholder with your own MongoDB URI. Do not commit .env or database credentials to GitHub.

Start the backend:

uvicorn main:app --reload

Backend URL: http://127.0.0.1:8000

API documentation: http://127.0.0.1:8000/docs

3. Configure the Frontend

Open a second terminal:

cd frontend
npm install
npm run dev

Open the local URL displayed by Vite, usually http://localhost:5173.

Keep the backend and frontend terminals running while using the application.

Validation and Testing

The following behaviors have been manually tested during development:

Duplicate transaction IDs return HTTP 409 Conflict.

Negative transaction amounts are rejected by validation.

Missing required fields return HTTP 422 Unprocessable Content.

Transaction search and combined risk/channel filters work.

Analytics and charts display data retrieved from the backend.

These are manual development checks, not a claim of comprehensive automated test coverage.

Current Limitations

Risk classification uses predefined rules, not a trained machine-learning model.

The dashboard's analytics depend on the available transaction data.

The current project is a demonstration application, not a production banking system.

Authentication, authorization, automated tests, and production deployment require further work if not yet implemented.

Future Enhancements

Customer analytics and customer detail views.

More detailed transaction-risk explanations.

Automated backend and frontend tests.

Authentication and role-based access control.

Deployment and production configuration.

Improved monitoring and audit logging.

Disclaimer

This project is intended for educational and interview-demonstration purposes. A transaction marked as suspicious is only flagged by the configured rules and should not be interpreted as confirmed fraud.

Author

Apoorv

Full-stack banking transaction risk and analytics project developed for technical learning and interview preparation.