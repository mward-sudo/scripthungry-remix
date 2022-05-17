import { RemixServer } from '@remix-run/react'
import type { EntryContext } from '@remix-run/server-runtime'
import isbot from 'isbot'
import { renderToReadableStream } from 'react-dom/server'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  let body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      onError() {
        responseStatusCode = 500
      },
    },
  )

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady
  }

  responseHeaders.set('Content-Type', 'text/html')

  return new Response(body, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
