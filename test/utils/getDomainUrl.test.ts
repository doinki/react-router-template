import { getDomainUrl } from '~/utils/getDomainUrl';

describe('getDomainUrl', () => {
  test('should return domain url when both X-Forwarded-Proto and X-Forwarded-Host headers are present', () => {
    const proto = 'https';
    const host = 'example.com';
    const url = proto + '://' + host;

    const headers = new Headers();
    headers.set('X-Forwarded-Proto', proto);
    headers.set('X-Forwarded-Host', host);

    const request = new Request('http://127.0.0.1', {
      headers: headers,
    });

    expect(getDomainUrl(request)).toBe(url);
  });

  test('should return domain url using X-Forwarded-Host when X-Forwarded-Proto is missing', () => {
    const proto = 'http';
    const host = 'example.com';
    const url = proto + '://' + host;

    const headers = new Headers();
    headers.set('X-Forwarded-Host', host);

    const request = new Request('https://127.0.0.1', {
      headers: headers,
    });

    expect(getDomainUrl(request)).toBe(url);
  });

  test('should return domain url using Host header when X-Forwarded-Host is missing', () => {
    const proto = 'http';
    const host = 'example.com';
    const url = proto + '://' + host;

    const headers = new Headers();
    headers.set('Host', host);

    const request = new Request('https://127.0.0.1', {
      headers: headers,
    });

    expect(getDomainUrl(request)).toBe(url);
  });

  test('should return domain url using X-Forwarded-Proto when only it is present', () => {
    const proto = 'https';
    const host = 'example.com';
    const url = proto + '://' + host;

    const headers = new Headers();
    headers.set('X-Forwarded-Proto', proto);

    const request = new Request('http://' + host, {
      headers: headers,
    });

    expect(getDomainUrl(request)).toBe(url);
  });

  test('should return domain url using request URL when no relevant headers are present', () => {
    const proto = 'http';
    const host = 'example.com';
    const url = proto + '://' + host;

    const request = new Request(url);

    expect(getDomainUrl(request)).toBe(url);
  });
});
