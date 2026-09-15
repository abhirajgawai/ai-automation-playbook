# Operations

Application directory: `/root/projects/ai-automation-playbook`.
Public hostname: `playbook.abhiraj.net`; expected IPv4: `187.127.219.78`.
Compose project: `ai-playbook`; service: `web`.

## Inspect

```sh
docker compose ps
docker compose logs --tail=100 web
curl -I https://playbook.abhiraj.net
curl -I https://playbook.abhiraj.net/guides/durable-execution
```

The health check uses container-local port 8080 and does not publish it. Public ports are 80 and 443 only. Logs rotate at 10 MB with three files. Runtime memory is capped at 256 MB and CPU at 0.5 cores; builds run separately and may need more memory.

## Update

Record the running image before changing it. Keep the previous image until validation succeeds.

```sh
docker inspect ai-playbook-web-1 --format '{{.Image}}'
git pull --ff-only
npm ci
npm run typecheck
npm test
node scripts/validate-content.mjs
npm run build
docker compose build
docker compose up -d
docker compose ps
```

Use `PLAYBOOK_VERSION=<commit>` with Compose to tag releases. Recheck browser journeys, deep links, HTTPS and the existing Hermes service. HTML uses `no-cache`; fingerprinted assets use immutable caching. An already-open old tab may need refreshing if it requests a removed lazy chunk after an update. No offline service worker is installed.

## Roll back

Retain a known-good image with a named tag before the next deployment. Set `PLAYBOOK_VERSION` to that tag and run `docker compose up -d --no-build`. Verify health and browser behavior. Do not delete certificate volumes or use broad Docker cleanup commands. Reverting website code does not recover browser data deleted by a user; import that user's saved export separately.

## DNS and HTTPS

```sh
dig +short A playbook.abhiraj.net
dig +short AAAA playbook.abhiraj.net
dig +short CAA abhiraj.net
ss -ltnp
```

Check A/AAAA reach this VPS, inbound 80/443 are permitted, and CAA allows the certificate issuer. Caddy requires outbound access to its ACME issuer and writable persistent `/data`. Inspect logs for renewal errors. Do not alter apex/www records, nameservers, SSH rules or the unrelated Hermes container while troubleshooting this application.

TLS state lives in the `ai-playbook_caddy_data` volume. Keep it through image updates and restart; replacing it can cause unnecessary issuance and rate limits. The portfolio on apex/www is hosted elsewhere.

## Recovery boundaries

Git plus the lockfile and Docker configuration recover published content and code. Back up certificate state if migrating the host. Browser-origin storage contains personal notes, reviews and project answers; users must export it themselves. HTTP/IP previews, HTTPS domain, browser profiles and devices have separate local storage. There is no server-side copy to restore.
