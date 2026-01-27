# ThunderTip

A non-custodial Telegram bot for sending bitcoin tips using Nostr Wallet Connect (NWC). Zap your friends, tip creators, and spread sats — all without giving up your keys.

## What is this?

ThunderTip lets you send Lightning payments directly from your own wallet through Telegram. No custodial accounts, no middlemen — just you, your keys, and the Lightning Network.

Built on [Nostr Wallet Connect](https://github.com/getAlby/nostr-wallet-connect), an open protocol for connecting apps to your Lightning wallet securely.

## Try It

[@ThunderTip_bot](https://t.me/ThunderTip_bot)

## Commands

| Command | Description |
|---------|-------------|
| `/start` | Say hello |
| `/help` | Show available commands |
| `/connection` | Connect your NWC-compatible wallet (DM only) |
| `/zap <@username> <amount>` | Send sats to a user |
| `/zap <amount>` | Reply to a message to tip its author |
| `/balance` | Check your wallet balance |
| `/nwc` | Learn more about Nostr Wallet Connect |

## Getting Started

1. DM [@ThunderTip_bot](https://t.me/ThunderTip_bot) and run `/connection`
2. Paste your NWC connection string from your wallet (e.g., Alby, Mutiny)
3. Start zapping in any group where the bot is present

## Self-Hosting

### Prerequisites

- Node.js
- Yarn
- A Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- A [Supabase](https://supabase.com) project

### Supabase Setup

Create a `users` table with the following schema:

| Column | Type | Notes |
|--------|------|-------|
| `telegram_user_id` | `text` | Primary key |
| `nwc_connect_link` | `text` | Encrypted NWC URI |
| `username` | `text` | Telegram username (lowercase) |

### Environment Variables

Configuration can be set via environment variables or a `.env` file in the project root.

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_TOKEN` | Yes | Telegram bot token from BotFather |
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_KEY` | Yes | Your Supabase anon/public key |
| `PASSWORD` | Yes | Secret key for encrypting stored NWC connections |
| `OWNER_ID` | No | Your Telegram user ID (receives error notifications) |
| `PORT` | No | HTTP server port (default: 3000) |

### Installation

```bash
# Clone the repo
git clone https://github.com/jesterhodl/ThunderTip.git
cd ThunderTip

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Build and run
yarn build
yarn start
```

## Support the Project

Wanna keep the bot running? Tips for server costs and maintenance are always appreciated.

Lightning Address: d4rp4t@npub.cash

## Contributing

PRs welcome. Keep it simple, keep it freedom-focused.

## License

MIT
