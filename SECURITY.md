# Security policy

## Reporting a vulnerability

Please do not open a public issue for credential exposure, authentication bypass, cross-origin abuse, unrestricted billable usage, or sensitive-data leakage. Contact the repository owner privately through the security reporting option on GitHub.

Include a minimal reproduction and impact description. Do not include a real OpenAI key, Realtime client secret, access token, private recording, or transcript.

## Supported version

Security fixes target the latest commit on the default branch.

## Deployment responsibility

Each lab provides security-oriented defaults, not a complete public SaaS perimeter. Operators are responsible for:

- project-scoped OpenAI credentials, budgets, rotation, and incident response;
- user authentication and authorization;
- a distributed rate limiter and per-user quotas;
- consent, retention, deletion, and regional compliance for audio data;
- dependency updates, monitoring, alerting, and abuse response;
- Vercel or equivalent platform access controls.

Realtime client secrets reduce exposure of the standard project key but remain short-lived bearer credentials. Deployments must protect the issuance route, minimize TTL and capabilities, and never log or persist the returned value.

Environment files are ignored recursively. Only an empty `.env.example` template belongs in version control; `.env`, `.env.local`, and Vercel-downloaded environment files must never be committed in the root or inside a lab.
