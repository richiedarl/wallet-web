# NOVA

A Next.js crypto intelligence and digital asset platform. Market and portfolio figures in this starter are illustrative mock data.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The local SQLite database is created at `data/nova.sqlite` on first request. Set `DATABASE_PATH` to use another file. `data/` and database files are ignored by Git.

## Accounts and admin access

- Users can register at `/register` or sign in at `/login`.
- Passwords are stored as scrypt hashes. Sessions use random opaque tokens in HttpOnly, SameSite cookies; only token hashes are stored in SQLite.
- To create an admin, first register the account normally, then run this command on the server that owns the database:

  ```bash
  npm run admin:promote -- admin@example.com
  ```

- Admins can view account emails and public linked wallet addresses, suspend/reactivate/delete user accounts, and unlink addresses. Admin actions are recorded in the audit log. Admins cannot view passwords or wallet secrets.
- Users can link an EVM address by signing a short, one-time verification message. This is not a transaction. Users can unlink addresses, change their account password, or delete their NOVA account from `/dashboard`.
- Wallet recovery phrases, seed phrases, private keys, and wallet passwords are never requested, transmitted, or stored. A wallet provider does not need these values to connect an address.

Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` using `.env.example` to enable WalletConnect. Never put private keys or recovery phrases in environment variables.

## Deployment notes

This implementation uses a local SQLite file and a native SQLite driver. Deploy it on a persistent Node.js host with durable storage and a single application instance; ephemeral/serverless filesystems and multi-instance writes are not supported. Back up and restrict access to the database file. For public production deployments, add email verification, password reset, MFA for admins, and centralized rate limiting before onboarding users. Configure HTTPS so production session cookies are Secure.

## Checks

```bash
npm run lint
npm run build
```
