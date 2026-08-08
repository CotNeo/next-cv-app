# Test account

For local development only. Do not create this account in production.

| Field | Value |
|-------|-------|
| Email | `test@example.com` |
| Password | `test123456` |
| Name | `Test User` |
| CV limit | 10 (new accounts get `FREE_CV_LIMIT`, default 3) |

## Creating it

### Script (local)

```bash
npm run create-test-user
```

Reads `.env.local`, connects to `MONGODB_URI` and creates the account if it does not already exist. Re-running it is safe.

### Register endpoint

Works against any running instance, including a preview deployment:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","password":"test123456"}'
```

Passwords must be at least 8 characters and contain both a letter and a digit. Registration is rate limited to 10 requests per hour per IP.

### Web UI

Go to http://localhost:3000/auth/register and sign up.

## Notes

- MongoDB must be reachable — see [MONGODB_SETUP.md](MONGODB_SETUP.md).
- The script runs locally only. For a deployed environment use the register endpoint or the UI; environment variables live in your host's dashboard.
