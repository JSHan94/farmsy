# zkLogin Setup Guide

This guide explains how to configure and use the zkLogin integration with Google authentication.

## Prerequisites

1. **Google Cloud Console Setup**
   - Create a project at [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Google+ API
   - Create OAuth 2.0 credentials (Web application type)
   - Add your domain to authorized JavaScript origins
   - Add your callback URL to authorized redirect URIs

## Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the environment variables:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   VITE_REDIRECT_URL=http://localhost:3000/auth/callback
   VITE_SUI_NETWORK=devnet
   ```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain
7. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - Your production callback URL

## How It Works

1. **Authentication Flow**:
   - User clicks "Connect with zkLogin" button
   - Application generates ephemeral key pair and nonce
   - User is redirected to Google OAuth
   - Google returns JWT token containing user info
   - Application verifies JWT and generates Sui address
   - User is authenticated and can use the app

2. **Components**:
   - `useZkLogin` hook manages authentication state
   - `WalletGuard` component handles both wallet and zkLogin auth
   - `AuthCallback` component processes OAuth redirect
   - Utility functions in `src/utils/zkLogin.ts`

## Usage

Once configured, users will see two authentication options:
- **Connect Wallet**: Traditional wallet connection via @mysten/dapp-kit
- **Connect with zkLogin**: Google-based authentication using zkLogin

Both methods provide access to the application, and users can switch between them as needed.

## Security Notes

- User salts are generated randomly for each session
- Ephemeral key pairs are stored only in session storage
- JWT tokens are validated before generating Sui addresses
- All sensitive operations happen client-side

## Troubleshooting

### Configuration Errors
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly
- Verify redirect URL matches Google Console settings
- Ensure authorized origins include your domain

### Authentication Failures
- Check browser console for detailed error messages
- Verify Google OAuth credentials are active
- Ensure callback URL is accessible

### Network Issues
- Confirm Sui network (devnet/testnet/mainnet) is accessible
- Check that @mysten/sui package is up to date