export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Try the exact requested asset first.
    let response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    // Clean URL support: /leaderboards -> /leaderboards.html
    // Skip real files/assets that already contain an extension.
    const lastSegment = pathname.split('/').pop() || '';
    const hasExtension = lastSegment.includes('.');

    if (!hasExtension && pathname !== '/') {
      const htmlUrl = new URL(request.url);
      htmlUrl.pathname = pathname.replace(/\/$/, '') + '.html';
      response = await env.ASSETS.fetch(new Request(htmlUrl, request));
      if (response.status !== 404) return response;
    }

    // Folder URL support: /guides/ -> /guides.html
    if (pathname.endsWith('/') && pathname !== '/') {
      const folderHtmlUrl = new URL(request.url);
      folderHtmlUrl.pathname = pathname.replace(/\/$/, '') + '.html';
      response = await env.ASSETS.fetch(new Request(folderHtmlUrl, request));
      if (response.status !== 404) return response;
    }

    // Serve the custom 404 page with a real 404 status.
    const notFoundUrl = new URL(request.url);
    notFoundUrl.pathname = '/404.html';
    const notFound = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    return new Response(notFound.body, {
      status: 404,
      headers: {
        'content-type': notFound.headers.get('content-type') || 'text/html; charset=UTF-8',
        'cache-control': 'no-cache'
      }
    });
  }
};
