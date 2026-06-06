# Backend Alignment Suggestions — From Frontend

**Date:** January 2026  
**From:** Frontend (Tara Health Companion)  
**To:** Backend Cursor Project  
**Re:** GDPR Compliance Update — Field Naming, Consent Model, and New Endpoints

---

## 1. Consent Field Naming Alignment (CRITICAL)

The frontend `DataConsentScreen` uses these consent category keys. The backend spec
currently uses different names. **Please align to these:**

| Frontend Key | Current Backend Key | Suggested Backend Key | Notes |
|---|---|---|---|
| `coreService` | `core_service` | `core_service` | ✅ Match (camelCase→snake_case in API layer) |
| `healthData` | `health_data` | `health_data` | ✅ Match |
| `aiModelProviders` | `ai_processing` | `ai_model_providers` | ⚠️ **Rename needed** — frontend renamed from `aiProcessing` to `aiModelProviders` to clarify these are third-party AI providers, not core AI chat. Core AI chat is part of `core_service`. |
| `documentStorage` | `document_storage` | `document_storage` | ✅ Match |
| `community` | `community` | `community` | ✅ Match |
| `clinicalSharing` | `clinical_sharing` | `clinical_sharing` | ⚠️ **Behaviour change** — see below |

### Clinical Sharing — Per-Event Model

The frontend now treats clinical sharing as **per-event consent**, not blanket consent.

- The `clinicalSharing` field is always `true` in the stored consent record (acknowledgement).
- Actual sharing consent is collected **each time** the user triggers "Share my Data".
- Each `POST /api/v2/share/generate` request IS the consent event.
- **Backend should NOT block share based on a stored `clinical_sharing: false`.**
- Instead, the share endpoint itself constitutes the consent action.

**Recommendation:** Remove `clinical_sharing` from the `POST /api/v2/consent/data`
payload entirely, OR always accept `true` and ignore `false`.

---

## 2. AI Model Providers — Behavioural Clarification (CRITICAL)

The frontend now clearly separates:

- **Core AI chat** = part of `core_service` (contract basis, Art. 6(1)(b))
- **Third-party AI model providers** = `ai_model_providers` (consent basis, Art. 6(1)(a))

**Backend behaviour when `ai_model_providers: false`:**

- AI chat should still be available (it's a core service feature).
- But messages should NOT be sent to third-party AI providers.
- Options:
  - (A) Use an in-house/self-hosted model fallback, OR
  - (B) Return a degraded response explaining AI chat is limited, OR
  - (C) Return 403 with `consent_required: "ai_model_providers"` and the frontend
    will show a prompt to enable it.

**Frontend currently shows:** "If disabled, AI chat functionality may be limited or unavailable."

**Please confirm which option (A/B/C) the backend will implement.**

---

## 3. New Endpoints the Frontend Now Expects

### 3.1 QR Code Share Flow (replaces `POST /api/v2/share-to-clinician`)

```
POST   /api/v2/share/generate
  Request:  { data_types: { mood, pathway, symptoms, documents_summary }, date_range?: { from, to } }
  Response: { share_id, qr_code_base64, token, expires_at, data_types }

GET    /api/v2/share/{token}          (PUBLIC — no auth required)
  Response: { patient_ref_id, data_summary: {...}, expires_at, created_at }
  Errors:   404 "Share link expired or revoked"

DELETE /api/v2/share/{share_id}
  Response: { message: "Share revoked" }

GET    /api/v2/share/history
  Response: { shares: [{ share_id, data_types, created_at, expires_at, status, revoked_at? }] }
```

**Notes:**
- QR code should encode a URL like `https://{domain}/share/{token}`
- Token should expire after 10 minutes
- The clinician view page (GET /share/{token}) should return JSON that the frontend
  renders as a read-only summary — NOT HTML
- `patient_ref_id` should be used instead of email/name for clinician display

### 3.2 Consent Withdrawal

```
DELETE /api/v2/consent/{consent_type}
  Where consent_type = health_data | ai_model_providers | document_storage | community
  Response: { message: "Consent withdrawn", consent_type, withdrawn_at }
```

**Backend must:**
- Append an immutable audit record (not overwrite)
- Disable relevant features immediately
- Preserve existing data (do not delete on withdrawal)
- Return 403 with `consent_required` on subsequent requests to disabled features

### 3.3 Clinical Team CRUD

```
POST   /api/v2/clinical-team
  Request:  { name, role, specialty?, contact_email? }
  Response: { id, name, role, specialty, contact_email, message }

DELETE /api/v2/clinical-team/{id}
  Response: { message: "Team member removed" }
```

### 3.4 Activity Audit Log

```
GET    /api/v2/me/activity-log?limit=50
  Response: {
    activities: [{
      id, type, description, timestamp, metadata?
    }]
  }
  Types: consent_granted, consent_withdrawn, data_shared, data_exported,
         account_created, account_deleted, document_uploaded, document_deleted
```

### 3.5 Document Upload

```
POST   /api/v2/documents/upload     (multipart/form-data)
  Fields: file (binary), name? (string)
  Response: { id, name, type, size, uploaded_at, message }
  Errors:
    413 → { detail: "File too large", max_size_mb: 10 }
    422 → { detail: "Invalid file type" | "Virus detected" }
    409 → { detail: "Storage limit reached", current_bytes, limit_bytes }
```

### 3.6 Community Events (Admin + Patient RSVP) — ✅ Implemented

**Scoping:** Clinician-scoped (JWT `sub` for admin; `PatientProfiles.clinician_id` for patients after associate). **Not** hospital-filtered via `X-Hospital-Id`. `hospital_id` on Event is metadata only.

**OpenAPI:** `http://localhost:8000/docs` (tag: Community Events / Admin Portal)

**Admin** — `Authorization: Bearer <admin_token>`:

```
GET    /api/v2/admin/events?status=all|published|cancelled&limit=50&offset=0
  Response: { events: [Event without user_has_rsvp], total_count }
  Errors:   404 wrong id / other clinician's event; 400 invalid id (undefined, etc.)

POST   /api/v2/admin/events
  Request:  { title, date (YYYY-MM-DD), time (HH:MM 24h), location?, type?, is_virtual?, description? }
  Response: 201 { id, message, event }
  Note:     starts_at = UTC ISO8601 with Z from date + time

PUT    /api/v2/admin/events/{id}
  Request:  partial update (same fields as POST, all optional)
  Rule:     if updating schedule, send both date AND time
  Response: { message, event }

DELETE /api/v2/admin/events/{id}
  Response: { message: "Event cancelled" }   (soft-delete: status → cancelled)
```

**Patient** — `Authorization: Bearer <patient_jwt>` required for GET and RSVP:

```
GET    /api/v2/events?when=upcoming|past&type=&limit=50&offset=0
  Response: { events: [Event with user_has_rsvp], total_count }
  Notes:   exclude cancelled; scope to associated clinician (not X-Hospital-Id)
  Errors:  404 no clinician association

GET    /api/v2/events/{id}
  Response: { event }
  Errors:   404 no association, wrong event, cancelled/unpublished

POST   /api/v2/events/{id}/rsvp
  Response: { message: "RSVP confirmed", event }
  Consent:  requires community consent (choices.community: true)
  Grant:    POST /api/v2/consent/data
  Check:    GET /api/v2/consent → data_consent.choices.community
  Errors:   403 { detail: { message, consent_type: "community" } }; 422 past event
  Rules:    event must be published and in the future; idempotent on repeat POST

DELETE /api/v2/events/{id}/rsvp
  Response: { message: "RSVP removed", event }
  Rules:    idempotent — returns 200 even if not RSVP'd
```

**Event object:** `id` (UUID — use in `/events/{id}/rsvp` URLs), `hospital_id` (metadata, nullable), `title`, `starts_at` (UTC `Z`), `location`, `type`, `is_virtual`, `description`, `status`, `attendee_count`, `user_has_rsvp` (patient only), `created_at`, `updated_at`.

**Frontend mapping:** EventsPage "Upcoming" → `when=upcoming`; "My Events" → filter client-side on `user_has_rsvp`; history → `when=past`. On RSVP 403, prompt user to enable community consent in Settings.

**Prerequisites:** Patient associated via `POST /api/v2/me/associate`; admin JWT `sub` matches event creator.

**Out of scope (v1):** patient-proposed events, calendar dot API, capacity/waitlists, reminders, hospital-wide feed via X-Hospital-Id only, frontend wiring (separate PR).

---

## 4. Guest User Blocking — Expected 401 Behaviour

The frontend will show a sign-in prompt when guests try to access health features.
But we also need the backend to enforce this.

**Endpoints that should return 401 for guest users (X-User-ID header):**

- All `/api/v2/mood*` endpoints
- All `/api/v2/symptoms*` endpoints
- All `/api/v2/appointments*` endpoints
- All `/api/v2/documents*` endpoints
- All `/api/v2/tests*` endpoints
- All `/api/v2/clinical-team*` endpoints
- All `/api/v2/share*` endpoints
- `POST /api/v2/consent/data` (guests don't need data consent)

**Endpoints that SHOULD allow guest users:**

- All `/api/v2/chat*` endpoints (Ask Tara)
- All `/api/v1/knowledge*` endpoints (Knowledge browsing)
- `GET /api/v2/profile/stages` (stage browsing)
- `GET /health` (health check)

**401 Response format for guests:**
```json
{
  "detail": "Authentication required",
  "code": "guest_not_allowed",
  "message": "Please sign in with Google to use this feature."
}
```

---

## 5. 403 Consent-Required Response Format

When a registered user tries to access a feature they haven't consented to:

```json
{
  "detail": "Consent required",
  "code": "consent_required",
  "consent_type": "health_data",
  "message": "Health data processing consent is required to use this feature."
}
```

The frontend will parse `consent_type` and show an appropriate prompt with a link
to the consent settings.

**Mapping:**

| consent_type | Frontend features blocked |
|---|---|
| `health_data` | Mood, Symptoms, Tests |
| `ai_model_providers` | AI chat (if option C chosen) |
| `document_storage` | Documents |
| `community` | Forum, Buddy, Events |

---

## 6. Data Export — Expanded Fields

The frontend expects the export to now include (in addition to existing fields):

```json
{
  "clinical_team": [{ "name", "role", "specialty" }],
  "share_history": [{ "share_id", "data_types", "created_at", "status" }],
  "activity_log": [{ "type", "description", "timestamp" }]
}
```

This is backwards compatible — just add the new top-level keys.

---

## 7. Cookie Consent — Remove "marketing"

The frontend cookie consent banner no longer lists "marketing" as a category.
It now says: "Non-essential cookies (for example, functional and analytics cookies)."

**Backend should:**
- Accept `marketing: false` gracefully in `POST /api/v2/consent/cookies` (don't reject)
- But the frontend will no longer send `marketing: true`

---

## Priority Order for Backend Implementation

| # | Feature | Severity | Frontend Blocked? |
|---|---------|----------|-------------------|
| 1 | Guest user 401 blocking | CRITICAL | No (frontend guards, but needs backend enforcement) |
| 2 | 403 consent-required responses | CRITICAL | No (frontend handles gracefully) |
| 3 | `DELETE /api/v2/consent/{type}` | CRITICAL | Yes — withdrawal button is wired up |
| 4 | `POST /api/v2/share/generate` + QR flow | HIGH | Yes — share page rewritten |
| 5 | `GET /api/v2/share/{token}` (public) | HIGH | Yes — clinician view page |
| 6 | `POST /api/v2/clinical-team` + DELETE | MEDIUM | Yes — add/remove buttons wired |
| 7 | `GET /api/v2/me/activity-log` | MEDIUM | Yes — activity log section |
| 8 | `POST /api/v2/documents/upload` | MEDIUM | Yes — upload functionality |
| 9 | Field rename: `ai_processing` → `ai_model_providers` | LOW | Handled in frontend mapping layer |

---

## Questions for Backend Team

1. **AI model providers opt-out:** Which option (A/B/C) will you implement? (see Section 2)
2. **Clinical sharing:** Can we remove `clinical_sharing` from the consent payload? (see Section 1)
3. **QR code generation:** Will the backend generate the QR image (base64) or just the URL token?
4. **Share token format:** UUID or JWT? Frontend doesn't care, just needs to render the QR.
5. **Activity log pagination:** Cursor-based or offset-based?
