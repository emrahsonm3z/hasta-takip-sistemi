export interface DroppableEvent {
  message?: string
  exception?: {
    values?: { value?: string }[]
  }
}

export interface DroppableStackedEvent extends DroppableEvent {
  exception?: {
    values?: {
      value?: string
      stacktrace?: { frames?: { filename?: string }[] }
    }[]
  }
}

const NOISE_PATTERNS = [
  /ResizeObserver loop limit exceeded/i,
  /ResizeObserver loop completed with undelivered notifications/i,
]

const EXTENSION_PROTOCOLS = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'safari-web-extension://',
]

function collectMessages(event: DroppableStackedEvent): string[] {
  const fromException = (event.exception?.values ?? [])
    .map((entry) => entry.value ?? '')
    .filter((value) => value.length > 0)
  return event.message ? [event.message, ...fromException] : fromException
}

function collectFrameFilenames(event: DroppableStackedEvent): string[] {
  return (event.exception?.values ?? []).flatMap((entry) =>
    (entry.stacktrace?.frames ?? [])
      .map((frame) => frame.filename ?? '')
      .filter((filename) => filename.length > 0),
  )
}

export function shouldDropErrorEvent(event: DroppableStackedEvent): boolean {
  const messages = collectMessages(event)
  if (messages.some((message) => NOISE_PATTERNS.some((p) => p.test(message)))) {
    return true
  }
  const filenames = collectFrameFilenames(event)
  return filenames.some((filename) =>
    EXTENSION_PROTOCOLS.some((protocol) => filename.startsWith(protocol)),
  )
}
