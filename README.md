# leadsheet.me UI

UI for uploading audio and generating leadsheets for the leadsheet.me service.

## Quickstart

```
yarn install
yarn dev
```

Other scripts: `yarn build`, `yarn start`, `yarn lint`.

## Environment

Create `.env.local` with these keys (no values shown here):

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_SECRET`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_API_URL`

`NEXT_PUBLIC_API_URL` can point to the hosted API or a local instance (e.g. `http://localhost:8080`).
