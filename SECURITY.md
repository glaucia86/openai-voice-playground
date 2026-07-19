# Security policy

## Reporting a vulnerability

Please do not open a public issue for credential exposure, authentication bypass, cross-origin abuse, unrestricted billable usage, or sensitive-data leakage. Contact the repository owner privately through the security reporting option on GitHub.

Include a minimal reproduction and impact description. Do not include a real OpenAI key, access token, private recording, or transcript.

## Supported version

Security fixes target the latest commit on the default branch.

## Deployment responsibility

This repository provides security-oriented defaults, not a complete public SaaS perimeter. Operators are responsible for:

- project-scoped OpenAI credentials, budgets, rotation, and incident response;
- user authentication and authorization;
- a distributed rate limiter and per-user quotas;
- consent, retention, deletion, and regional compliance for audio data;
- dependency updates, monitoring, alerting, and abuse response;
- Vercel or equivalent platform access controls.
