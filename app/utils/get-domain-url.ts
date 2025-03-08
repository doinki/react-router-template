export function getDomainUrl(request: Request): string {
  const protocol = request.headers.get('X-Forwarded-Proto') ?? 'http';
  const host =
    request.headers.get('X-Forwarded-Host') ??
    request.headers.get('host') ??
    new URL(request.url).host;

  return `${protocol}://${host}`;
}
