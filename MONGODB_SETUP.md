# MongoDB setup

CV Builder needs a MongoDB database. Set the connection string as `MONGODB_URI` in `.env.local`.

Indexes are declared on the Mongoose models and created automatically on first connect — no migration step.

---

## Local

### Docker (quickest)

```bash
docker run -d --name cv-mongo -p 27017:27017 mongo:7
```

```env
MONGODB_URI=mongodb://localhost:27017/cv-builder
```

With authentication enabled:

```bash
docker run -d --name cv-mongo -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=your-password \
  mongo:7
```

```env
MONGODB_URI=mongodb://admin:your-password@localhost:27017/cv-builder?authSource=admin
```

`authSource` matters: the user is defined in the `admin` database, not in `cv-builder`.

### Native install

macOS:

```bash
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community
```

Then `MONGODB_URI=mongodb://localhost:27017/cv-builder`.

---

## Hosted

### MongoDB Atlas (recommended for production)

1. Create a cluster.
2. Database Access → add a user with a strong password.
3. Network Access → allow your deployment's egress IPs, or set up VPC peering. Avoid `0.0.0.0/0` in production.
4. Copy the connection string:

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/cv-builder?retryWrites=true&w=majority
```

URL-encode special characters in the password — `@` becomes `%40`, `#` becomes `%23`, and so on.

In production the app **rejects** the localhost default, so `MONGODB_URI` must be set explicitly.

### Other providers

Any MongoDB-compatible service works (DigitalOcean, Railway, Render). Use the provider's connection string as-is.

---

## Verifying

Start the app and check the health endpoint:

```bash
curl -s localhost:3000/api/health
# {"status":"ok","checks":{"database":"up","ai":"configured"},...}
```

`"database":"down"` and a 503 mean the URI, credentials or network rules are wrong.

## Troubleshooting

| Symptom | Cause |
|---------|-------|
| `ECONNREFUSED` | MongoDB is not running, or the host/port is wrong |
| `Authentication failed` | Wrong credentials, or a missing `authSource=admin` |
| `querySrv ENOTFOUND` | Malformed `mongodb+srv://` host |
| Timeouts from a deployed instance | The host's IP is not in the Atlas network allowlist |

Connections are pooled and cached across invocations ([src/lib/mongodb.ts](src/lib/mongodb.ts)), so a single process never opens more than one pool.

Test account: [TEST_USER.md](TEST_USER.md).
