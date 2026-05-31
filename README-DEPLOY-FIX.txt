EvaulxMC Cloudflare Workers Static Assets Deploy

This package is built for the error you saw:
"Could not detect a directory containing static files"

Use this command from inside this folder:

  npx wrangler deploy

Why this version works:
- Static website files are inside ./public
- wrangler.toml tells Wrangler where the static files are:
  [assets]
  directory = "./public"
- src/worker.js handles clean URLs like /leaderboards -> /leaderboards.html
- No invalid _redirects file is included
- Custom 404 page is returned with a real 404 status by the Worker

Do not upload just the ZIP to wrangler deploy. Unzip it first, open the extracted folder in terminal, then run:

  npm install
  npx wrangler deploy

If you want to change the project name, edit this line in wrangler.toml:

  name = "evaulxmc"

Important:
Cloudflare Pages Direct Upload and Workers Wrangler deploy are different. This package is for Workers Wrangler deploy.
