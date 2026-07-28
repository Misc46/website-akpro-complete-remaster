# Fonnte Group Messaging — Next.js Integration Guide

Developer-facing reference for sending messages to **WhatsApp Groups** from a Next.js application using [Fonnte](https://docs.fonnte.com/), an unofficial WhatsApp gateway (automates a real WhatsApp Web session).

> Fonnte's official tutorials are written in PHP, but the underlying service is a plain REST API — anything that can make an HTTP request works, including Node/Next.js. There's no separate "group" endpoint: the same `/send` endpoint used for 1:1 messages accepts a WhatsApp group ID as the `target`.

**Reference docs used for this guide:**
- Send message (full param reference): https://docs.fonnte.com/api-send-message/
- Get WhatsApp Group ID: https://docs.fonnte.com/get-whatsapp-group-id/
- Native JS/fetch example: https://docs.fonnte.com/api-send-message-with-javascript/
- English docs: https://docs.fonnte.com/language/en/

---

## 1. Prerequisites

1. **Fonnte account** at [fonnte.com](https://fonnte.com), with a **device** created and connected (scan QR from the dashboard).
2. **Device token** — copied from the device page. This is your `Authorization` header value, not a query param.
3. **Group membership** — the connected number must already be in the target group. Admin rights aren't required unless the group restricts messaging to admins.

---

## 2. Environment Variables

```env
# .env.local
FONNTE_TOKEN=your_device_token_here
```

Fonnte doesn't require a configurable base URL — the API is always `https://api.fonnte.com`. Keep `FONNTE_TOKEN` server-side only; never expose it to the client.

---

## 3. Understanding the Group Target

WhatsApp groups are identified by an ID ending in `@g.us` (e.g. `120363022123456789@g.us`), same convention as the underlying WhatsApp protocol. Fonnte doesn't require the `@g.us` suffix explicitly in most examples — it accepts the group ID as-is in the `target` field, the same field used for a phone number in a 1:1 message.

### Getting your group IDs (two-step process)

Fonnte does **not** fetch group lists live on every request — you have to pre-index them once.

**Step 1 — Fetch/update your group list** (call this once, or whenever you join a new group):

```
POST https://api.fonnte.com/fetch-group
Authorization: TOKEN
```

No body required. This tells Fonnte to sync the list of groups the connected device is currently a member of.

**Step 2 — Retrieve the indexed group list:**

```
POST https://api.fonnte.com/get-whatsapp-group
Authorization: TOKEN
```

Returns the group IDs and names captured by Step 1. If you call this before ever calling `/fetch-group`, you'll get an empty result.

> Re-run `/fetch-group` whenever your connected number joins a new group — `/get-whatsapp-group` only reflects whatever was captured at the last sync.

---

## 4. Core Setup: a Reusable Fonnte Client

```typescript
// lib/fonnte.ts
'use server'

const FONNTE_TOKEN = process.env.FONNTE_TOKEN
const BASE_URL = 'https://api.fonnte.com'

type FonnteResponse<T = any> = { success: true; data: T } | { success: false; error: string }

function assertConfigured() {
  if (!FONNTE_TOKEN) {
    throw new Error('FONNTE_TOKEN environment variable is missing.')
  }
}

/**
 * Generic POST helper for Fonnte endpoints that expect multipart/form-data.
 * Pass `target` as a phone number for 1:1 messages, or a WhatsApp group ID for groups.
 */
export async function fonntePost<T = any>(
  endpoint: string,
  fields: Record<string, string | number | boolean | undefined>
): Promise<FonnteResponse<T>> {
  assertConfigured()

  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) formData.append(key, String(value))
  }

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { Authorization: FONNTE_TOKEN! },
      body: formData,
    })

    const data = await response.json()

    if (!data.status) {
      throw new Error(data.reason || data.detail || `Fonnte request to ${endpoint} failed`)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error(`Fonnte error [${endpoint}]:`, error.message)
    return { success: false, error: error.message }
  }
}

/** Sync the device's current group membership (call once, or after joining new groups). */
export async function refreshGroupList() {
  assertConfigured()

  try {
    const response = await fetch(`${BASE_URL}/fetch-group`, {
      method: 'POST',
      headers: { Authorization: FONNTE_TOKEN! },
    })
    const data = await response.json()
    return { success: true, data }
  } catch (error: any) {
    console.error('Fonnte refreshGroupList error:', error.message)
    return { success: false, error: error.message }
  }
}

/** Get the previously-synced list of groups (id + name). */
export async function getGroupList() {
  assertConfigured()

  try {
    const response = await fetch(`${BASE_URL}/get-whatsapp-group`, {
      method: 'POST',
      headers: { Authorization: FONNTE_TOKEN! },
    })
    const data = await response.json()

    return { success: true, data: data as Array<{ id: string; name: string }> }
  } catch (error: any) {
    console.error('Fonnte getGroupList error:', error.message)
    return { success: false as const, error: error.message }
  }
}
```

---

## 5. Server Actions per Message Type

The `/send` endpoint handles every message type through one set of fields — media is just `url` (or `file`) added to the same request as the text message.

### 5.1 Text Message

```typescript
// app/actions/fonnte-group.ts
'use server'

import { fonntePost } from '@/lib/fonnte'

export async function sendGroupText(groupId: string, message: string) {
  return fonntePost('send', {
    target: groupId,
    message,
  })
}
```

### 5.2 Media from URL (image, video, audio, document)

```typescript
export async function sendGroupMediaFromUrl(
  groupId: string,
  mediaUrl: string,
  caption?: string,
  filename?: string
) {
  return fonntePost('send', {
    target: groupId,
    message: caption,
    url: mediaUrl,
    filename,
  })
}
```

### 5.3 Media from a Local File (uploaded through your app)

Fonnte's raw API accepts multipart file uploads (`CURLFile` in their PHP examples). In Next.js, pass a `File`/`Blob` straight into the `FormData` instead of converting to base64 first:

```typescript
// app/actions/fonnte-group.ts
'use server'

const FONNTE_TOKEN = process.env.FONNTE_TOKEN

export async function sendGroupLocalFile(
  groupId: string,
  file: File,
  caption?: string
) {
  if (!FONNTE_TOKEN) throw new Error('FONNTE_TOKEN is missing.')

  const formData = new FormData()
  formData.append('target', groupId)
  if (caption) formData.append('message', caption)
  formData.append('file', file, file.name)

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: FONNTE_TOKEN },
      body: formData,
    })
    const data = await response.json()
    if (!data.status) throw new Error(data.reason || 'Fonnte send failed')
    return { success: true, data }
  } catch (error: any) {
    console.error('Fonnte local file error:', error.message)
    return { success: false, error: error.message }
  }
}
```

> Server Actions in Next.js can receive `File` objects directly from a `<form>` submission or a client-constructed `FormData`, so this slots in naturally if your upload UI already produces a `File`.

### 5.4 Location

Fonnte accepts location as a single comma-separated `location` field (`"lat, lng"`) rather than separate fields:

```typescript
export async function sendGroupLocation(groupId: string, lat: number, lng: number) {
  return fonntePost('send', {
    target: groupId,
    location: `${lat}, ${lng}`,
  })
}
```

### 5.5 Delayed / Scheduled Send

Useful for group announcements you want staggered or timed:

```typescript
export async function sendGroupTextScheduled(
  groupId: string,
  message: string,
  unixTimestamp: number
) {
  return fonntePost('send', {
    target: groupId,
    message,
    schedule: unixTimestamp,
  })
}
```

### 5.6 Typing Indicator Before Sending

Useful when a message takes a moment to prepare (e.g. waiting on an AI response) and you want the group to see a "typing…" presence first:

```typescript
export async function sendGroupTextWithTyping(
  groupId: string,
  message: string,
  typingDurationSeconds = 3
) {
  return fonntePost('send', {
    target: groupId,
    message,
    typing: true,
    duration: typingDurationSeconds,
  })
}
```

---

## 6. Fetching & Selecting a Group on the Client

```typescript
// app/actions/fonnte-group.ts
'use server'

import { getGroupList, refreshGroupList } from '@/lib/fonnte'

export async function listMyGroups() {
  return getGroupList()
}

export async function syncMyGroups() {
  return refreshGroupList()
}
```

```tsx
// app/components/GroupPicker.tsx
'use client'

import { useEffect, useState } from 'react'
import { listMyGroups, syncMyGroups } from '@/app/actions/fonnte-group'

type Group = { id: string; name: string }

export default function GroupPicker({ onSelect }: { onSelect: (groupId: string) => void }) {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listMyGroups().then((result) => {
      if (result.success) setGroups(result.data)
      setLoading(false)
    })
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    await syncMyGroups()
    const result = await listMyGroups()
    if (result.success) setGroups(result.data)
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <select onChange={(e) => onSelect(e.target.value)} className="border rounded p-2 w-full">
        <option value="">{loading ? 'Loading groups...' : 'Select a group'}</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
      <button onClick={handleRefresh} className="text-sm text-blue-600 underline">
        Refresh group list (run after joining a new group)
      </button>
    </div>
  )
}
```

---

## 7. Full Example: Send Form Client Component

```tsx
// app/components/SendGroupMessageForm.tsx
'use client'

import { useState } from 'react'
import { sendGroupText } from '@/app/actions/fonnte-group'
import GroupPicker from './GroupPicker'

export default function SendGroupMessageForm() {
  const [groupId, setGroupId] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const handleSend = async () => {
    if (!groupId) {
      setStatus('Pick a group first.')
      return
    }
    setStatus('Sending...')
    const result = await sendGroupText(groupId, message)
    setStatus(result.success ? 'Message sent successfully!' : `Failed: ${result.error}`)
  }

  return (
    <div className="space-y-3">
      <GroupPicker onSelect={setGroupId} />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your announcement..."
        className="border rounded p-2 w-full"
      />
      <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded">
        Send to Group
      </button>
      <p>{status}</p>
    </div>
  )
}
```

---

## 8. Response Shape Reference

A successful `/send` call returns:

```json
{
  "detail": "success! message in queue",
  "id": ["80367170"],
  "process": "pending",
  "requestid": 2937124,
  "status": true,
  "target": ["120363022123456789@g.us"]
}
```

- `status: true` means the request was accepted into the queue — it doesn't guarantee delivery. Fonnte processes sends asynchronously.
- If `status` is ever `false`, check `reason`/`detail` for why (invalid token, disconnected device, invalid target, etc).
- Fonnte notes that on rare server-hiccup responses, `detail` may indicate the message is delayed but still pending — worth logging `requestid` so you can trace it if you have webhook status updates configured.

---

## 9. Troubleshooting & Common Errors

| Symptom | Likely Cause | Fix |
|---|---|---|
| `get-whatsapp-group` returns empty | Never called `fetch-group` yet | Call `fetch-group` once, then retry `get-whatsapp-group` |
| Group not receiving messages | Group set to "Admins only" and connected number isn't admin | Promote the number, or have an existing admin lift the restriction |
| `status: false`, reason mentions device | Device disconnected (WhatsApp Web session dropped) | Reconnect via QR from the Fonnte dashboard |
| `status: false`, invalid token | Wrong or expired token | Re-copy the token from the device page |
| Media not sending | Package/plan doesn't include media support | Fonnte's cheapest tier is text-only; media requires an upgraded package |
| Messages queued but slow | High volume without spacing | Use the `delay` field between multiple targets rather than firing everything at once |

---

## 10. Best Practices

- **Never expose `FONNTE_TOKEN` to the client.** All calls should go through Server Actions or Route Handlers.
- **Cache the group list** client-side after fetching — `/get-whatsapp-group` doesn't change unless you re-sync, so there's no need to hit it on every render.
- **Re-run `/fetch-group` deliberately, not on every request.** It's meant to be called once (or after joining new groups), not as part of your regular send flow.
- **Use `delay` for multi-target sends**, not a manual loop — Fonnte explicitly recommends against looping `/send` calls for bulk messaging; use comma-separated `target` values or the `data` array parameter instead (see their [Sending API Messages docs](https://docs.fonnte.com/api-send-message/) for the bulk/array format).
- **Treat delivery as async.** A `status: true` response only means "queued," not "delivered" — if you need delivery confirmation, look into Fonnte's webhook status update feature rather than assuming success from the initial response.
- **This is still an unofficial WhatsApp Web automation**, same category as Whapi.id — the connected number carries the same ban risk from Meta as any other gateway of this type, regardless of provider.
