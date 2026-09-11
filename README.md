# irlscanning.com

Static assets for the IRL Scanning website. Forgejo is the primary repository;
GitHub is a push mirror and runs the production deployment.

## Branch flow

1. Create a development branch from `staging`.
2. Open a pull request from the development branch into `staging`.
3. Merge the development pull request after review. Every update to `staging`
   deploys to <https://site.intranet.irlscanning.com/staging/>.
4. Open a pull request from `staging` into `main` to release. Branch protection
   rejects any other source branch for `main`.

Direct pushes to `staging` and `main` are disabled, including for repository
administrators.

## Preview deployments

Comment exactly `!deploy` on an open pull request. The commenter must have
write or admin permission and the pull request must originate in this
repository. A DNS-safe branch name is deployed under
`site.intranet.irlscanning.com/<branch>/` for 14 days. Repeating `!deploy`
replaces the deployment and extends its expiration. Garage lifecycle rules
expire the preview objects without requiring changes to VPN configuration.

Branch names that are not already valid lowercase DNS labels are normalized
and receive an eight-character hash suffix. The workflow reports the final URL
on the pull request.

## Production setup

The production workflow is present but exits successfully without deploying
until the Backblaze and Cloudflare accounts are configured on the GitHub mirror.

Create a public Backblaze B2 bucket and an application key restricted to that
bucket with list, read, write, and delete permissions. Configure these GitHub
Actions secrets:

- `B2_KEY_ID`
- `B2_APPLICATION_KEY`
- `CLOUDFLARE_API_TOKEN`: restricted to Cache Purge for the site zone

Configure these GitHub Actions variables:

- `B2_BUCKET`: production bucket name
- `B2_REGION`: B2 region such as `us-west-004`
- `B2_ENDPOINT`: S3 endpoint such as `https://s3.us-west-004.backblazeb2.com`
- `CLOUDFLARE_ZONE_ID`: Cloudflare zone identifier

In Cloudflare, create the production hostname and route it to the public B2
bucket endpoint. Keep the bucket origin inaccessible for writes except through
the restricted application key. The workflow synchronizes `public/` to B2 and
purges the Cloudflare cache after each update to `main`.

## Local preview

Serve `public/` with any static HTTP server, for example:

```bash
python -m http.server --directory public 8080
```

## Brand assets

The logo, palette, typography, and logomark pattern follow the Penpot
`Style Guide 2026`. The site self-hosts Nimbus Sans L Bold for display text and
Geist for body text so the typography does not depend on a third-party CDN.

Nimbus Sans L is distributed by URW++ under GPL-2.0; its license is included at
`public/fonts/NIMBUS-SANS-L-LICENSE.txt` and the original package is available
from <https://www.fontsquirrel.com/fonts/nimbus-sans-l>. Geist is distributed
by Vercel under the SIL Open Font License 1.1; its license is included at
`public/fonts/GEIST-LICENSE.txt`.

## Contact form

`public/contact.html` contains a static mailto form. Its small progressive
enhancement script builds a structured draft addressed to
`hello@irlscanning.com` and opens the visitor's configured email application;
the visitor must send the draft from that application. No form data is posted
to the site or a third-party service.

## Penpot MCP

This repository configures OpenCode to use Penpot's hosted MCP server. The MCP
key is read from `~/.config/opencode/secrets/penpot-mcp-token` instead of being
committed in `opencode.json`.

Create the user-level secret file before starting OpenCode:

```sh
install -d -m 700 "$HOME/.config/opencode/secrets"
umask 077
"${EDITOR:-vi}" "$HOME/.config/opencode/secrets/penpot-mcp-token"
chmod 600 "$HOME/.config/opencode/secrets/penpot-mcp-token"
```

The file must contain only the MCP key from **Your account -> Integrations ->
MCP Server** in Penpot. It must not contain the complete server URL.

Open a Penpot design and select **File -> MCP Server -> Connect**. Keep its
Penpot tab open while using the MCP. After regenerating the MCP key in Penpot,
replace the contents of the user-level secret file and restart OpenCode.
