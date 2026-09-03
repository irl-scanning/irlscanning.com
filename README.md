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
