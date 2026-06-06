# Backend API Specification for Tara Health Companion

**Generated:** January 2026  
**Frontend Version:** 1.0.0 (`tara-health-companion`)  
**Base URL:** `/api/v1` (legacy) and `/api/v2` (current)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Existing APIs – Chat](#2-existing-apis--chat)
3. [Existing APIs – Knowledge](#3-existing-apis--knowledge)
4. [Existing APIs – Profile & Stages](#4-existing-apis--profile--stages)
5. [Existing APIs – Forum](#5-existing-apis--forum)
6. [Existing APIs – Health Check](#6-existing-apis--health-check)
7. [NEW – Dashboard](#7-new--dashboard)
8. [NEW – Mood Tracking](#8-new--mood-tracking)
9. [NEW – Symptom Tracking](#9-new--symptom-tracking)
10. [NEW – Appointments](#10-new--appointments)
11. [NEW – Documents](#11-new--documents)
12. [NEW – Clinical Team](#12-new--clinical-team)
13. [NEW – Share Data with Clinician](#13-new--share-data-with-clinician)
14. [NEW – Physical Tests](#14-new--physical-tests)
15. [NEW – GDPR / Data Rights](#15-new--gdpr--data-rights)
16. [Error Handling Conventions](#16-error-handling-conventions)
17. [Frontend Feature → API Mapping](#17-frontend-feature--api-mapping)
18. [NEW – Community Events](#18-new--community-events)

---

## 1. Authentication

The frontend uses two authentication methods. All authenticated endpoints must support both.

### Google OAuth (Registered Users)

```
Header: Authorization: Bearer <GOOGLE_JWT_TOKEN>
```

- Token obtained from Google Sign-In on the client.
- Stored in `localStorage` as `auth_token`.
- Backend must validate JWT signature, issuer (`accounts.google.com`), and expiry.
- User identity extracted from JWT claims (`sub`, `email`, `name`, `picture`).

### Guest Users

```
Header: X-User-ID: guest_<username>_<timestamp>
```

- Guest token stored in `localStorage` as `guest:<base64_json>`.
- JSON payload: `{ id: "guest_..._<ts>", name: string, isGuest: true, exp: number }`.
- Backend should create a temporary user record or session for guests.
- Guest data may be ephemeral (cleared after 7 days).

### Session Expiry Handling

- Frontend clears `auth_token` and reloads on **401** response.
- Exception: If the token was set within the last 5 seconds (race condition during OAuth login), the 401 is ignored.
- Frontend dispatches `auth:session-expired` event before reloading.

---

## 2. Existing APIs – Chat

### POST `/api/v2/chat/`

Primary chat endpoint (v2). Used by Ask Tara (ChatPage).

**Request:**
```json
{
  "message": "string (required)",
  "session_id": "string | null",
  "conversation_history": [
    { "role": "user | assistant", "content": "string" }
  ],
  "include_trace": false
}
```

**Response:**
```json
{
  "request_id": "string",
  "session_id": "string",
  "response": "string (markdown)",
  "intent": "string",
  "stage": "string",
  "citations": [
    {
      "source_file": "string",
      "section": "string | null",
      "page_start": "number | null",
      "page_end": "number | null",
      "relevance_score": "number | null",
      "url": "string | null",
      "video_id": "string | null",
      "video_url": "string | null",
      "timestamped_url": "string | null",
      "video_title": "string | null",
      "channel": "string | null",
      "start_timestamp": "string | null"
    }
  ],
  "confidence": "number (0-1) | null",
  "abstained": "boolean",
  "disclaimer_included": "boolean",
  "suggested_videos": [
    {
      "video_id": "string",
      "title": "string",
      "url": "string",
      "channel_name": "string | null",
      "relevance_note": "string | null",
      "timestamp_seconds": "number | null"
    }
  ],
  "trace": "array | null",
  "total_latency_ms": "number | null",
  "needs_onboarding": "boolean | null",
  "sign_in_suggestion": "string | null",
  "show_sources": "boolean (default true)"
}
```

### POST `/api/v1/chat`

Legacy v1 chat endpoint (kept for compatibility).

**Request:**
```json
{
  "message": "string (required)",
  "session_id": "string | null",
  "context": "object | null",
  "index_name": "string | null",
  "strict_mode": "boolean",
  "include_sources": "boolean"
}
```

**Response:**
```json
{
  "session_id": "string",
  "answer": "string",
  "sources": [
    {
      "title": "string",
      "url": "string | null",
      "snippet": "string | null",
      "source_text": "string | null",
      "relevance_score": "number | null"
    }
  ],
  "disclaimer": "string",
  "suggested_questions": ["string"],
  "timestamp": "ISO8601",
  "has_sufficient_evidence": "boolean | null",
  "support_helpline": "string | null",
  "support_helpline_name": "string | null",
  "conversation_id": "string | null",
  "conversation_created_at": "ISO8601 | null"
}
```

### GET `/api/v1/chat/history/{session_id}`

Retrieve chat history for a session.

**Response:**
```json
{
  "session_id": "string",
  "messages": [
    { "role": "user | assistant", "content": "string", "timestamp": "ISO8601" }
  ],
  "message_count": "number"
}
```

### DELETE `/api/v1/chat/history/{session_id}`

Clear chat history for a session.

**Response:**
```json
{ "message": "History cleared" }
```

### POST `/api/v1/chat/feedback`

Submit feedback on a chat response.

**Request:**
```json
{
  "conversation_id": "string (required)",
  "created_at": "ISO8601 (required)",
  "rating": "thumbs_up | thumbs_down",
  "feedback_text": "string | null"
}
```

**Response:**
```json
{ "message": "Feedback recorded" }
```

---

## 3. Existing APIs – Knowledge

### POST `/api/v1/knowledge/search`

Search knowledge base documents.

**Request:**
```json
{
  "query": "string (required)",
  "k": "number (default 10)",
  "filters": "object | null"
}
```

**Response:**
```json
{
  "query": "string",
  "results": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "topic": "string | null",
      "subtopic": "string | null",
      "source": "string | null",
      "last_updated": "ISO8601 | null",
      "relevance_score": "number | null"
    }
  ],
  "total_results": "number",
  "search_time_ms": "number | null"
}
```

### GET `/api/v1/knowledge/topics`

List all topics and subtopics.

**Response:**
```json
{
  "topics": [
    { "id": "string", "name": "string", "subtopics": ["string"] }
  ]
}
```

### GET `/api/v1/knowledge/document/{document_id}`

Retrieve a specific knowledge document.

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "topic": "string | null",
  "subtopic": "string | null",
  "source": "string | null",
  "last_updated": "ISO8601 | null",
  "relevance_score": "number | null"
}
```

### GET `/api/v1/knowledge/indexes`

List available knowledge indexes.

**Response:**
```json
{
  "indexes": [
    {
      "index_name": "string",
      "display_name": "string",
      "description": "string | null",
      "document_count": "number"
    }
  ]
}
```

---

## 4. Existing APIs – Profile & Stages

### GET `/api/v2/profile/status`

Check onboarding status for authenticated user.

**Response:**
```json
{
  "onboarding_completed": "boolean",
  "current_stage": "string",
  "needs_onboarding": "boolean"
}
```

### POST `/api/v2/profile/onboarding`

Submit onboarding data.

**Request:**
```json
{
  "current_situation": "string (required)",
  "diagnosis_date": "string | null",
  "diagnosis_type": "string | null",
  "current_treatments": ["string"] | null,
  "treatment_start_date": "string | null"
}
```

**Response:**
```json
{
  "profile": {
    "user_id": "string",
    "current_stage": "string",
    "onboarding_completed": "boolean"
  },
  "message": "string"
}
```

### PUT `/api/v2/profile/stage`

Update user's treatment stage (simple).

**Request:**
```json
{ "new_stage": "string" }
```

**Response:** Same as `ProfileResponse` above.

### POST `/api/v2/profile/link`

Link account via Patient Reference ID.

**Request:**
```json
{ "patient_ref_id": "string" }
```

**Response:** Same as `ProfileResponse` above.

### GET `/api/v2/profile/stages`

Get hierarchical stage tree for UI selector.

**Response:**
```json
{
  "stages": [
    {
      "stage": {
        "stage_id": "string",
        "name": "string",
        "description": "string",
        "parent_stage_id": "string | null",
        "child_stage_ids": ["string"],
        "transition_notes": "string | null",
        "is_patient_facing": "boolean"
      },
      "children": ["(recursive StageTreeNode)"]
    }
  ],
  "total_count": "number"
}
```

### GET `/api/v2/profile/stages/{stage_id}`

Get details for a specific stage.

**Response:**
```json
{
  "stage": "(TreatmentStage)",
  "parent": "(TreatmentStage | null)",
  "children": ["(TreatmentStage)"],
  "breadcrumb": ["string"]
}
```

### PUT `/api/v2/profile/stage/select`

Select a detailed treatment stage.

**Request:**
```json
{ "stage_id": "string" }
```

**Response:**
```json
{
  "message": "string",
  "stage_id": "string",
  "stage_name": "string",
  "breadcrumb": ["string"]
}
```

### GET `/api/v2/profile/my-stage`

Get current user's stage with context.

**Response:**
```json
{
  "stage_id": "string | null",
  "stage_name": "string",
  "breadcrumb": ["string"],
  "description": "string | null",
  "ai_context": "string | null"
}
```

---

## 5. Existing APIs – Forum

Base path: `/api/v1/forum`

### GET `/api/v1/forum/categories`

**Response:**
```json
[
  {
    "category_id": "string",
    "name": "string",
    "description": "string",
    "icon": "string",
    "color": "string",
    "post_count": "number"
  }
]
```

### GET `/api/v1/forum/posts`

**Query params:** `category` (optional), `page` (default 1), `page_size` (default 20), `sort` (`new | top | hot`).

**Response:**
```json
{
  "posts": [
    {
      "post_id": "string",
      "category_id": "string",
      "title": "string",
      "content_preview": "string",
      "user_display_name": "string",
      "is_anonymous": "boolean",
      "vote_count": "number",
      "comment_count": "number",
      "created_at": "ISO8601",
      "tags": ["string"],
      "is_pinned": "boolean"
    }
  ],
  "total_count": "number",
  "page": "number",
  "page_size": "number",
  "has_more": "boolean"
}
```

### GET `/api/v1/forum/posts/{post_id}`

**Response:**
```json
{
  "post": {
    "post_id": "string",
    "category_id": "string",
    "title": "string",
    "content": "string",
    "user_display_name": "string",
    "is_anonymous": "boolean",
    "vote_count": "number",
    "comment_count": "number",
    "created_at": "ISO8601",
    "tags": ["string"],
    "is_pinned": "boolean",
    "user_vote": "1 | -1 | null"
  },
  "comments": [
    {
      "comment_id": "string",
      "content": "string",
      "user_display_name": "string",
      "is_anonymous": "boolean",
      "vote_count": "number",
      "depth": "number",
      "created_at": "ISO8601",
      "user_vote": "1 | -1 | null",
      "replies": ["(recursive Comment)"]
    }
  ]
}
```

### POST `/api/v1/forum/posts`

**Request:**
```json
{
  "title": "string",
  "content": "string",
  "category_id": "string",
  "tags": ["string"],
  "is_anonymous": "boolean"
}
```

**Response:** Full `Post` object.

### DELETE `/api/v1/forum/posts/{post_id}`

**Response:** `{ "message": "Deleted" }`

### POST `/api/v1/forum/posts/{post_id}/comments`

**Request:**
```json
{
  "content": "string",
  "parent_comment_id": "string | null",
  "is_anonymous": "boolean"
}
```

**Response:** Full `Comment` object.

### DELETE `/api/v1/forum/comments/{comment_id}`

**Response:** `{ "message": "Deleted" }`

### POST `/api/v1/forum/vote`

**Request:**
```json
{
  "target_type": "post | comment",
  "target_id": "string",
  "vote": "1 | -1 | 0"
}
```

**Response:**
```json
{
  "success": "boolean",
  "new_vote_count": "number",
  "user_vote": "1 | -1 | null"
}
```

### POST `/api/v1/forum/report`

**Request:**
```json
{
  "target_type": "post | comment",
  "target_id": "string",
  "reason": "string"
}
```

**Response:** `{ "message": "Report submitted" }`

---

## 6. Existing APIs – Health Check

### GET `/health`

Backend health check (no auth required).

**Response:**
```json
{
  "status": "healthy | degraded | unhealthy",
  "timestamp": "ISO8601",
  "version": "string",
  "environment": "string",
  "services": { "service_name": "status_string" }
}
```

---

## 7. NEW – Dashboard

### GET `/api/v2/dashboard/summary`

Returns aggregated metrics for the home screen dashboard.

**Used by:** DashboardPage (Home tab)

**Request:** None (user identified via auth headers).

**Response:**
```json
{
  "wellness_score": "number (0-100)",
  "streak_days": "number",
  "avg_mood": "number (0.0-10.0, 1 decimal)",
  "trend_direction": "up | down | stable",
  "trend_percentage": "number (e.g. 15 for +15%)",
  "next_appointment": {
    "id": "string",
    "title": "string",
    "clinician_name": "string",
    "specialty": "string",
    "date": "ISO8601",
    "time": "string (e.g. '10:30 AM')",
    "location": "string",
    "reminder_set": "boolean"
  } | null,
  "daily_quote": {
    "text": "string",
    "author": "string"
  } | null
}
```

**Notes:**
- `wellness_score` is computed from mood, activity, and symptom data.
- `streak_days` is the consecutive days the user has logged mood or activity.
- `next_appointment` is the soonest upcoming appointment, or null if none.
- `daily_quote` is optional; can return null and frontend uses a default.

---

## 8. NEW – Mood Tracking

### POST `/api/v2/mood`

Log a mood entry.

**Used by:** BasicMoodPage, AdvancedMoodPage

**Request:**
```json
{
  "mood_score": "number (1-10, required)",
  "note": "string | null",
  "emotions": ["string"] | null,
  "triggers": ["string"] | null,
  "quick_check": {
    "sleep_quality": "good | somewhat | poor" | null,
    "physical_discomfort": "none | mild | moderate | severe" | null,
    "energy_level": "high | normal | low" | null
  } | null,
  "timestamp": "ISO8601 | null (defaults to now)"
}
```

**Response:**
```json
{
  "id": "string",
  "message": "Mood logged",
  "mood_score": "number",
  "timestamp": "ISO8601"
}
```

### GET `/api/v2/mood`

Get mood history with optional date range.

**Query params:** `from` (ISO8601, optional), `to` (ISO8601, optional), `limit` (number, default 30).

**Response:**
```json
{
  "entries": [
    {
      "id": "string",
      "mood_score": "number",
      "note": "string | null",
      "emotions": ["string"] | null,
      "triggers": ["string"] | null,
      "quick_check": "object | null",
      "timestamp": "ISO8601"
    }
  ],
  "total_count": "number",
  "avg_mood": "number",
  "trend_direction": "up | down | stable",
  "trend_percentage": "number"
}
```

### GET `/api/v2/mood/weekly-pattern`

Get the last 7 days mood pattern.

**Response:**
```json
{
  "pattern": [
    {
      "day": "string (Mon, Tue, ...)",
      "date": "ISO8601",
      "mood_score": "number | null",
      "primary_emotion": "string | null"
    }
  ]
}
```

---

## 9. NEW – Symptom Tracking

### POST `/api/v2/symptoms`

Log a symptom entry.

**Used by:** SymptomsPage

**Request:**
```json
{
  "symptom_name": "string (required)",
  "severity": "number (1-10, required)",
  "notes": "string | null",
  "timestamp": "ISO8601 | null"
}
```

**Response:**
```json
{
  "id": "string",
  "message": "Symptom logged",
  "symptom_name": "string",
  "severity": "number",
  "timestamp": "ISO8601"
}
```

### GET `/api/v2/symptoms`

Get symptom log history.

**Query params:** `from` (ISO8601, optional), `to` (ISO8601, optional), `limit` (number, default 30).

**Response:**
```json
{
  "entries": [
    {
      "id": "string",
      "symptom_name": "string",
      "severity": "number",
      "notes": "string | null",
      "timestamp": "ISO8601"
    }
  ],
  "total_count": "number"
}
```

### GET `/api/v2/symptoms/trends`

Get weekly symptom trends.

**Response:**
```json
{
  "trends": [
    {
      "symptom_name": "string",
      "direction": "up | down | stable",
      "change_percentage": "string (e.g. '-12%')",
      "avg_severity": "number"
    }
  ]
}
```

### GET `/api/v2/symptoms/tracked`

Get list of symptoms the user has chosen to track.

**Response:**
```json
{
  "tracked_symptoms": [
    {
      "id": "number",
      "name": "string",
      "icon": "string (emoji)"
    }
  ]
}
```

### PUT `/api/v2/symptoms/tracked`

Update list of tracked symptoms.

**Request:**
```json
{
  "symptom_names": ["string"]
}
```

**Response:**
```json
{ "message": "Tracked symptoms updated", "count": "number" }
```

---

## 10. NEW – Appointments

### GET `/api/v2/appointments`

List all appointments.

**Used by:** AppointmentsPage, DashboardPage

**Query params:** `status` (`upcoming | completed | all`, default `all`), `limit` (number, default 50).

**Response:**
```json
{
  "appointments": [
    {
      "id": "string",
      "title": "string",
      "date": "ISO8601",
      "time": "string (e.g. '10:30 AM')",
      "location": "string",
      "reminder": "string | null (e.g. '1 day before')",
      "status": "upcoming | completed | cancelled"
    }
  ],
  "total_count": "number"
}
```

### POST `/api/v2/appointments`

Create a new appointment.

**Request:**
```json
{
  "title": "string (required)",
  "date": "ISO8601 (required)",
  "time": "string (required)",
  "location": "string | null",
  "reminder": "string | null"
}
```

**Response:**
```json
{
  "id": "string",
  "message": "Appointment created",
  "appointment": "(full appointment object)"
}
```

### PUT `/api/v2/appointments/{id}`

Update an existing appointment.

**Request:** Same shape as POST (all fields optional for partial update).

**Response:**
```json
{
  "message": "Appointment updated",
  "appointment": "(full appointment object)"
}
```

### DELETE `/api/v2/appointments/{id}`

Delete/cancel an appointment.

**Response:**
```json
{ "message": "Appointment cancelled" }
```

---

## 11. NEW – Documents

### GET `/api/v2/documents`

List user's documents (metadata only, no file bodies).

**Used by:** DocumentsPage

**Response:**
```json
{
  "documents": [
    {
      "id": "string",
      "name": "string",
      "type": "pdf | jpg | png",
      "date": "ISO8601",
      "size": "string (e.g. '245 KB')",
      "size_bytes": "number"
    }
  ],
  "total_count": "number",
  "total_size_bytes": "number",
  "storage_limit_bytes": "number"
}
```

### POST `/api/v2/documents/upload`

Upload a document.

**Request:** `multipart/form-data` with field `file` (PDF, JPG, PNG, max 10 MB).

**Response:**
```json
{
  "id": "string",
  "message": "Document uploaded",
  "document": "(full document metadata object)"
}
```

### GET `/api/v2/documents/{id}/download`

Download a document file.

**Response:** Binary file stream with appropriate `Content-Type` and `Content-Disposition` headers.

### DELETE `/api/v2/documents/{id}`

Delete a document.

**Response:**
```json
{ "message": "Document deleted" }
```

---

## 12. NEW – Clinical Team

### GET `/api/v2/clinical-team`

Get the patient's assigned clinical team.

**Used by:** ClinicalTeamPage (Team tab)

**Response:**
```json
{
  "team_members": [
    {
      "id": "string",
      "name": "string",
      "role": "string (e.g. 'Consultant surgeon', 'CNS', 'Oncologist')",
      "specialty": "string | null",
      "avatar_url": "string | null",
      "contact_email": "string | null",
      "contact_phone": "string | null"
    }
  ]
}
```

**Notes:**
- If no team is assigned, return `{ "team_members": [] }`.
- Team assignment is managed by hospital admin or via patient link (`POST /api/v2/profile/link`).

---

## 13. NEW – Share Data with Clinician (QR Code Flow)

### POST `/api/v2/share/generate`

Generate a temporary QR code link for the clinician to scan.

**Used by:** ShareDataPage (Profile > Share my Data)

**Request:**
```json
{
  "data_types": {
    "mood": "boolean",
    "pathway": "boolean",
    "symptoms": "boolean",
    "documents_summary": "boolean"
  },
  "date_range": {
    "from": "ISO8601 | null",
    "to": "ISO8601 | null"
  }
}
```

**Response:**
```json
{
  "share_id": "string",
  "qr_code_base64": "string (base64-encoded PNG of QR code)",
  "token": "string (unique share token)",
  "expires_at": "ISO8601 (10 minutes from creation)",
  "data_types": { "mood": true, "pathway": true, "symptoms": false, "documents_summary": false }
}
```

### GET `/api/v2/share/{token}` (PUBLIC — no auth required)

Clinician views patient data summary by scanning QR code.

**Response:**
```json
{
  "patient_ref_id": "string (NOT email or user ID)",
  "data_summary": {
    "mood": { "avg_score": 7.2, "entries": 14, "trend": "improving" },
    "pathway": { "current_stage": "Post-treatment", "started": "2024-01-15" },
    "symptoms": { "active": ["fatigue", "joint_pain"], "resolved": 3 },
    "documents": [{ "name": "Blood Test", "date": "2024-01-15" }]
  },
  "expires_at": "ISO8601",
  "created_at": "ISO8601"
}
```

**Error (expired/revoked):** 404 `{ "detail": "Share link expired or revoked" }`

### DELETE `/api/v2/share/{share_id}`

Revoke an active share link.

**Response:** `{ "message": "Share revoked" }`

### GET `/api/v2/share/history`

Get sharing audit trail for the user.

**Response:**
```json
{
  "shares": [
    {
      "share_id": "string",
      "data_types": { "mood": true, "pathway": true },
      "created_at": "ISO8601",
      "expires_at": "ISO8601",
      "status": "active | expired | revoked",
      "revoked_at": "ISO8601 | null"
    }
  ]
}
```

**Notes:**
- QR code encodes URL: `https://{domain}/share/{token}`
- Token expires after 10 minutes.
- Clinician view shows `patient_ref_id`, NOT email or Firebase UID.
- Each share is a per-event consent action under GDPR Art. 9(2)(a).
- All shares are logged in the activity audit trail.
- Legacy endpoint `POST /api/v2/share-to-clinician` is deprecated.

---

## 14. NEW – Physical Tests

### POST `/api/v2/tests/results`

Log a physical test result.

**Used by:** TestsPage

**Request:**
```json
{
  "test_id": "string (e.g. '1mile', 'sit-stand', 'balance')",
  "test_name": "string",
  "result_value": "string (e.g. '14:32', '12 reps', '28 sec')",
  "result_numeric": "number | null (for comparison, e.g. seconds)",
  "duration_seconds": "number | null",
  "timestamp": "ISO8601 | null"
}
```

**Response:**
```json
{
  "id": "string",
  "message": "Test result recorded",
  "test_id": "string",
  "result_value": "string",
  "timestamp": "ISO8601"
}
```

### GET `/api/v2/tests/results`

Get test result history.

**Query params:** `test_id` (optional, filter by test type), `limit` (number, default 20).

**Response:**
```json
{
  "results": [
    {
      "id": "string",
      "test_id": "string",
      "test_name": "string",
      "result_value": "string",
      "result_numeric": "number | null",
      "timestamp": "ISO8601"
    }
  ],
  "total_count": "number"
}
```

### GET `/api/v2/tests/trends`

Get trend data for test improvements.

**Response:**
```json
{
  "trends": [
    {
      "test_id": "string",
      "test_name": "string",
      "last_result": "string",
      "last_date": "ISO8601",
      "improvement": "string (e.g. '+5%', '+2 reps')",
      "direction": "up | down | stable"
    }
  ]
}
```

---

## 15. NEW – GDPR / Data Rights

### POST `/api/v2/consent/cookies`

Record **cookie** consent choices (ePrivacy / GDPR audit trail).

**Used by:** Cookie consent banner

**Request:**
```json
{
  "consent_version": "string (e.g. 'v1')",
  "choices": {
    "necessary": true,
    "functional": "boolean",
    "analytics": "boolean",
    "marketing": "boolean"
  },
  "timestamp": "ISO8601",
  "source": "banner | settings"
}
```

**Response:**
```json
{
  "message": "Cookie consent recorded",
  "consent_id": "string",
  "recorded_at": "ISO8601"
}
```

### POST `/api/v2/consent/data`

Record **data processing** consent choices (GDPR Art. 6 & Art. 9 audit trail).

**Used by:** Data consent screen (shown after first login), Profile → Manage Data Consent

**Request:**
```json
{
  "consent_version": "string (e.g. 'v1')",
  "choices": {
    "core_service": true,
    "health_data": "boolean (Art. 6(1)(b) + Art. 9(2)(a) – explicit consent for special category data)",
    "ai_model_providers": "boolean (consent for third-party AI provider processing)",
    "document_storage": "boolean",
    "community": "boolean",
    "clinical_sharing": true
  },
  "timestamp": "ISO8601",
  "source": "onboarding | settings"
}
```

**Response:**
```json
{
  "message": "Data consent recorded",
  "consent_id": "string",
  "recorded_at": "ISO8601"
}
```

**Notes:**
- Each consent record must be stored as an immutable audit entry (never overwrite — append only).
- `core_service` is always `true`; the backend should reject requests without it.
- When `health_data` is `false`, the backend must not store mood, symptom, or test data. Return 403 with `consent_required: "health_data"`.
- When `ai_model_providers` is `false`, the backend should still allow chat but must not send messages to third-party AI providers. Use fallback or return degraded response.
- `clinical_sharing` is always `true` (per-event consent model — actual consent is given at each `POST /api/v2/share/generate` call).
- When `document_storage` is `false`, the backend must not accept document uploads. Return 403 with `consent_required: "document_storage"`.
- When `community` is `false`, the backend must not allow forum posts. Return 403 with `consent_required: "community"`.

### GET `/api/v2/consent`

Get current consent preferences for the user (both cookie and data consent).

**Response:**
```json
{
  "cookie_consent": {
    "consent_id": "string | null",
    "consent_version": "string",
    "choices": {
      "necessary": true,
      "functional": "boolean",
      "analytics": "boolean",
      "marketing": "boolean"
    },
    "last_updated": "ISO8601 | null"
  },
  "data_consent": {
    "consent_id": "string | null",
    "consent_version": "string",
    "choices": {
      "core_service": true,
      "health_data": "boolean",
      "ai_model_providers": "boolean",
      "document_storage": "boolean",
      "community": "boolean",
      "clinical_sharing": true
    },
    "last_updated": "ISO8601 | null"
  }
}
```

### GET `/api/v2/me/export`

Export all user data (GDPR Article 20 – Data Portability).

**Response:** JSON file download with `Content-Type: application/json` and `Content-Disposition: attachment; filename="tara_data_export_{date}.json"`.

**Response body:**
```json
{
  "export_date": "ISO8601",
  "export_version": "1.0",
  "user_profile": {
    "user_id": "string",
    "name": "string",
    "email": "string",
    "current_stage": "string",
    "onboarding_completed": "boolean",
    "created_at": "ISO8601"
  },
  "consent_history": [
    { "consent_id": "string", "choices": "object", "timestamp": "ISO8601" }
  ],
  "chat_history": [
    {
      "session_id": "string",
      "messages": [{ "role": "string", "content": "string", "timestamp": "ISO8601" }]
    }
  ],
  "mood_logs": [
    { "mood_score": "number", "note": "string | null", "emotions": ["string"], "timestamp": "ISO8601" }
  ],
  "symptom_logs": [
    { "symptom_name": "string", "severity": "number", "notes": "string | null", "timestamp": "ISO8601" }
  ],
  "test_results": [
    { "test_name": "string", "result_value": "string", "timestamp": "ISO8601" }
  ],
  "appointments": [
    { "title": "string", "date": "ISO8601", "location": "string", "status": "string" }
  ],
  "documents_metadata": [
    { "name": "string", "type": "string", "date": "ISO8601", "size": "string" }
  ],
  "forum_posts": [
    { "post_id": "string", "title": "string", "content": "string", "created_at": "ISO8601" }
  ],
  "forum_comments": [
    { "comment_id": "string", "content": "string", "created_at": "ISO8601" }
  ]
}
```

### DELETE `/api/v2/me`

Request account deletion (GDPR Article 17 – Right to Erasure).

**Request:**
```json
{
  "confirmation": "DELETE MY ACCOUNT"
}
```

**Response:**
```json
{
  "message": "Account deletion initiated",
  "effective_date": "ISO8601",
  "notes": "Your data will be permanently deleted within 30 days. Forum posts will be anonymized."
}
```

**Notes:**
- Forum posts may be **anonymized** rather than deleted to preserve thread context (user_display_name replaced with "Deleted User").
- Uploaded documents must be permanently deleted from storage.
- Chat history must be permanently deleted.
- A confirmation string is required to prevent accidental deletion.
- Backend may implement a grace period (e.g. 30 days) before permanent deletion.

### DELETE `/api/v2/consent/{consent_type}`

Withdraw a specific consent type.

**Path params:** `consent_type` = `health_data` | `ai_model_providers` | `document_storage` | `community`

**Response:**
```json
{
  "message": "Consent withdrawn",
  "consent_type": "health_data",
  "withdrawn_at": "ISO8601"
}
```

**Notes:**
- Must append an immutable audit record (never overwrite previous consent).
- Disable relevant features immediately.
- Preserve existing data (do not delete on withdrawal).
- Subsequent requests to affected endpoints must return 403 with `consent_required`.

### GET `/api/v2/me/activity-log`

Get the user's GDPR accountability audit trail.

**Query params:** `limit` (number, default 50)

**Response:**
```json
{
  "activities": [
    {
      "id": "string",
      "type": "consent_granted | consent_withdrawn | data_shared | data_exported | account_created | document_uploaded | document_deleted",
      "description": "string",
      "timestamp": "ISO8601",
      "metadata": "object | null"
    }
  ]
}
```

### POST `/api/v2/documents/upload`

Upload a document (multipart/form-data).

**Content-Type:** `multipart/form-data`

**Fields:**
- `file` (required) — binary file data
- `name` (optional) — custom display name

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "type": "string (pdf, jpg, png)",
  "size": "string (e.g. '245 KB')",
  "uploaded_at": "ISO8601",
  "message": "Document uploaded"
}
```

**Error responses:**
- 413: `{ "detail": "File too large", "max_size_mb": 10 }`
- 422: `{ "detail": "Invalid file type" }` or `{ "detail": "Virus detected" }`
- 409: `{ "detail": "Storage limit reached", "current_bytes": 104857600, "limit_bytes": 104857600 }`

### POST `/api/v2/clinical-team`

Add a self-reported clinical team member.

**Request:**
```json
{
  "name": "string",
  "role": "string",
  "specialty": "string | null",
  "contact_email": "string | null"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "role": "string",
  "specialty": "string | null",
  "avatar_url": null,
  "contact_email": "string | null",
  "message": "Team member added"
}
```

### DELETE `/api/v2/clinical-team/{id}`

Remove a clinical team member.

**Response:** `{ "message": "Team member removed" }`

---

## 16. Error Handling Conventions

All API errors should follow this format:

```json
{
  "detail": "Human-readable error message",
  "status_code": "number"
}
```

### Standard HTTP status codes

| Code | Meaning | Frontend Behavior |
|------|---------|-------------------|
| 200 | Success | Process response |
| 201 | Created | Process response |
| 400 | Bad Request | Show error message to user |
| 401 | Unauthorized | Clear token, show session expired modal, reload. For guests accessing health features: show sign-in prompt with `code: "guest_not_allowed"` |
| 403 | Forbidden / Consent Required | If `consent_type` field is present: show consent prompt. Otherwise: show "access denied" message |
| 404 | Not Found | Show "not found" or empty state |
| 422 | Validation Error | Show field-specific errors |
| 429 | Rate Limited | Show "too many requests" message |
| 500 | Server Error | Show generic error, log to console |

---

## 17. Frontend Feature → API Mapping

| Frontend Feature | Page/Component | API Endpoint | Status |
|------------------|----------------|--------------|--------|
| Ask Tara (chat) | ChatPage | `POST /api/v2/chat/` | ✅ Exists |
| Chat history | ChatPage | `GET /api/v1/chat/history/{id}` | ✅ Exists |
| Chat feedback | MessageBubble | `POST /api/v1/chat/feedback` | ✅ Exists |
| Knowledge search | TopicsBrowser | `POST /api/v1/knowledge/search` | ✅ Exists |
| Knowledge topics | TopicsBrowser | `GET /api/v1/knowledge/topics` | ✅ Exists |
| Knowledge indexes | Header/IndexSelector | `GET /api/v1/knowledge/indexes` | ✅ Exists |
| Onboarding status | App | `GET /api/v2/profile/status` | ✅ Exists |
| Submit onboarding | OnboardingWizard | `POST /api/v2/profile/onboarding` | ✅ Exists |
| Treatment stages | StageSelectorPage | `GET /api/v2/profile/stages` | ✅ Exists |
| Select stage | StageSelectorPage | `PUT /api/v2/profile/stage/select` | ✅ Exists |
| My stage | DashboardPage | `GET /api/v2/profile/my-stage` | ✅ Exists |
| Forum categories | CommunityHub | `GET /api/v1/forum/categories` | ✅ Exists |
| Forum posts | ForumHome | `GET/POST /api/v1/forum/posts` | ✅ Exists |
| Forum comments | PostDetail | `POST /api/v1/forum/posts/{id}/comments` | ✅ Exists |
| Forum voting | VoteButtons | `POST /api/v1/forum/vote` | ✅ Exists |
| **Dashboard summary** | DashboardPage | `GET /api/v2/dashboard/summary` | ❌ New |
| **Log mood** | BasicMoodPage | `POST /api/v2/mood` | ❌ New |
| **Mood history** | BasicMoodPage | `GET /api/v2/mood` | ❌ New |
| **Weekly mood** | AdvancedMoodPage | `GET /api/v2/mood/weekly-pattern` | ❌ New |
| **Log symptom** | SymptomsPage | `POST /api/v2/symptoms` | ❌ New |
| **Symptom history** | SymptomsPage | `GET /api/v2/symptoms` | ❌ New |
| **Symptom trends** | SymptomsPage | `GET /api/v2/symptoms/trends` | ❌ New |
| **Tracked symptoms** | SymptomsPage | `GET/PUT /api/v2/symptoms/tracked` | ❌ New |
| **List appointments** | AppointmentsPage | `GET /api/v2/appointments` | ❌ New |
| **Create appointment** | AppointmentsPage | `POST /api/v2/appointments` | ❌ New |
| **Update appointment** | AppointmentsPage | `PUT /api/v2/appointments/{id}` | ❌ New |
| **Delete appointment** | AppointmentsPage | `DELETE /api/v2/appointments/{id}` | ❌ New |
| **List documents** | DocumentsPage | `GET /api/v2/documents` | ❌ New |
| **Upload document** | DocumentsPage | `POST /api/v2/documents/upload` | ❌ New |
| **Download document** | DocumentsPage | `GET /api/v2/documents/{id}/download` | ❌ New |
| **Delete document** | DocumentsPage | `DELETE /api/v2/documents/{id}` | ❌ New |
| **Clinical team** | ClinicalTeamPage | `GET /api/v2/clinical-team` | ❌ New |
| **Share data** | ShareDataPage | `POST /api/v2/share-to-clinician` | ❌ New |
| **Log test result** | TestsPage | `POST /api/v2/tests/results` | ❌ New |
| **Test history** | TestsPage | `GET /api/v2/tests/results` | ❌ New |
| **Test trends** | TestsPage | `GET /api/v2/tests/trends` | ❌ New |
| **Record consent** | CookieConsent | `POST /api/v2/consent` | ❌ New |
| **Get consent** | PrivacySettings | `GET /api/v2/consent` | ❌ New |
| **Export data** | ProfilePage | `GET /api/v2/me/export` | ❌ New |
| **Delete account** | ProfilePage | `DELETE /api/v2/me` | ❌ New |
| **Admin events list** | AdminEventsPage | `GET /api/v2/admin/events` | ✅ Exists |
| **Create event** | AdminEventsPage | `POST /api/v2/admin/events` | ✅ Exists |
| **Update event** | AdminEventsPage | `PUT /api/v2/admin/events/{id}` | ✅ Exists |
| **Cancel event** | AdminEventsPage | `DELETE /api/v2/admin/events/{id}` | ✅ Exists |
| **List events** | EventsPage | `GET /api/v2/events` | ✅ Exists |
| **Event detail** | EventsPage | `GET /api/v2/events/{id}` | ✅ Exists |
| **RSVP to event** | EventsPage | `POST /api/v2/events/{id}/rsvp` | ✅ Exists |
| **Cancel RSVP** | EventsPage | `DELETE /api/v2/events/{id}/rsvp` | ✅ Exists |

---

## 18. NEW – Community Events

**Status:** ✅ Implemented (OpenAPI tag: Community Events / Admin Portal — `http://localhost:8000/docs`)

Clinician-scoped community events with admin CRUD and patient read + RSVP.

**Used by:** AdminEventsPage (`/admin/events`), EventsPage (`/community/events`), CommunityHub (optional upcoming count)

**Base paths:** Admin `/api/v2/admin/events` · Patient `/api/v2/events`

### Scoping (implemented behavior)

| Topic | Backend behavior |
|-------|------------------|
| **Admin list** | Clinician-scoped via JWT `sub` — admin sees only events they created |
| **Patient list** | Events from `PatientProfiles.clinician_id` (after `POST /api/v2/me/associate`); **not** filtered by `X-Hospital-Id` |
| **`hospital_id` on Event** | Metadata from admin JWT (e.g. `"barts"` or `null`); not used for filtering |
| **Event id in JSON** | Field is `id` (UUID). Use in URLs: `/events/{id}/rsvp` |
| **`starts_at`** | Server combines admin `date` + `time` as UTC ISO8601 with `Z` suffix |
| **Browse vs RSVP** | Patient `GET` requires auth only. RSVP requires `community` consent (`choices.community: true`) |

**Auth:**
- Admin: `Authorization: Bearer <admin_token>` (same as other `/api/v2/admin/*` routes)
- Patient: `Authorization: Bearer <patient_jwt>` required for `GET` and RSVP. Optional `X-User-ID`, `X-Hospital-Id` headers are accepted but **not used** for event filtering.

**Prerequisites:**
- Patient must be associated with a clinician (`POST /api/v2/me/associate`) or event lists return empty / 404 on detail
- Admin token `sub` must match the clinician who created the events

**Out of scope (v1):** Patient-proposed events (FAB on EventsPage), calendar dot API, capacity limits / waitlists, email/push reminders, forum/buddy integration, hospital-wide event feed via `X-Hospital-Id` only.

### Event object (response)

```json
{
  "id": "uuid",
  "hospital_id": "barts | null",
  "title": "string",
  "starts_at": "2026-07-01T14:30:00Z",
  "location": "string | null",
  "type": "wellness | support | education",
  "is_virtual": "boolean",
  "description": "string | null",
  "status": "published | cancelled",
  "attendee_count": "number",
  "user_has_rsvp": "boolean (patient endpoints only; omitted or null on admin list)",
  "created_at": "ISO8601",
  "updated_at": "ISO8601"
}
```

**Notes:**
- `attendee_count` is the count of active RSVPs (replaces mock `attendees` in AdminEventsPage).
- Admin `DELETE` sets `status` to `cancelled` (soft-delete); cancelled events are excluded from patient upcoming/past lists but remain visible in admin list.
- JSON field names use snake_case (`is_virtual`, `attendee_count`, `user_has_rsvp`).

### RSVP record (internal)

```json
{
  "event_id": "string",
  "user_id": "string",
  "rsvp_at": "ISO8601"
}
```

Unique constraint on `(event_id, user_id)`.

---

### 18.1 Admin Events

**Base path:** `/api/v2/admin/events`

#### GET `/api/v2/admin/events`

List this clinician's events (including cancelled).

**Query params:**

| Param | Values | Default |
|-------|--------|---------|
| `status` | `all` \| `published` \| `cancelled` | `all` |
| `limit` | number | `50` (max `200`) |
| `offset` | number | `0` |

**Response:**
```json
{
  "events": ["(Event object without user_has_rsvp)"],
  "total_count": "number"
}
```

**Errors:** `404` — wrong id or event belongs to another clinician · `400` — invalid/placeholder id (e.g. `undefined`)

#### POST `/api/v2/admin/events`

Create event.

**Request:**
```json
{
  "title": "string (required)",
  "date": "YYYY-MM-DD (required)",
  "time": "HH:MM 24h (required)",
  "location": "string | null (optional)",
  "type": "wellness | support | education (default wellness)",
  "is_virtual": "boolean (default false)",
  "description": "string | null (optional)"
}
```

**Response:** `201`
```json
{
  "id": "uuid",
  "message": "Event created",
  "event": "(Event object)"
}
```

#### PUT `/api/v2/admin/events/{id}`

Update event. Same request shape as POST; all fields optional (partial update).

**Schedule rule:** If updating date/time, **both** `date` and `time` must be sent together.

**Response:**
```json
{
  "message": "Event updated",
  "event": "(Event object)"
}
```

#### DELETE `/api/v2/admin/events/{id}`

Soft-cancel event (`status → cancelled`). Preserves RSVP history.

**Response:** `{ "message": "Event cancelled" }`

---

### 18.2 Patient Events & RSVP

**Base path:** `/api/v2/events`

#### GET `/api/v2/events`

List published events for the patient's associated clinician.

**Auth:** `Authorization: Bearer <patient_jwt>` required.

**Query params:**

| Param | Values | Default | Purpose |
|-------|--------|---------|---------|
| `when` | `upcoming` \| `past` | `upcoming` | Future vs history (`past` = all past published events) |
| `type` | `wellness` \| `support` \| `education` | all | Optional filter |
| `limit` | number | 50 | Pagination |
| `offset` | number | 0 | Pagination |

**Sorting:** `starts_at` ASC for upcoming, DESC for past.

**Filtering:** Exclude `status: cancelled`. Scope to patient's associated clinician (not `X-Hospital-Id`).

**Response:**
```json
{
  "events": ["(Event object with user_has_rsvp)"],
  "total_count": "number"
}
```

**Frontend mapping:**

| UI tab | API call |
|--------|----------|
| Upcoming | `GET /api/v2/events?when=upcoming` |
| My Events | Same response, filter client-side where `user_has_rsvp === true` |
| History (future UI) | `GET /api/v2/events?when=past` |

**Errors:** `404` — no clinician association, wrong event, or cancelled/unpublished for detail

#### GET `/api/v2/events/{id}`

Single event detail (for "View Details" on My Events tab).

**Response:** `{ "event": "(Event object with user_has_rsvp)" }`

#### POST `/api/v2/events/{id}/rsvp`

RSVP the authenticated user.

**Consent:** Requires `community` consent. No new consent API — use existing endpoints:
- Grant: `POST /api/v2/consent/data` with `choices.community: true`
- Check: `GET /api/v2/consent` → `data_consent.choices.community`
- On `403`, prompt user to enable community in Settings.

**Rules:**
- Event must exist, be `published`, and have `starts_at` in the future
- Idempotent: second POST returns `200` with existing RSVP (no duplicate)

**Response:**
```json
{
  "message": "RSVP confirmed",
  "event": "(Event object, user_has_rsvp: true, updated attendee_count)"
}
```

**Errors:**
- `422` — RSVP to past event
- `403` — community consent missing:
```json
{
  "detail": {
    "message": "Community consent is required to RSVP to events...",
    "consent_type": "community"
  }
}
```

#### DELETE `/api/v2/events/{id}/rsvp`

Remove RSVP.

**Rules:** Idempotent — deleting when not RSVP'd returns `200`.

**Response:**
```json
{
  "message": "RSVP removed",
  "event": "(Event object, user_has_rsvp: false)"
}
```

**Errors:** Standard 404 patterns from Section 16.

---

## Summary of New Endpoints Required

| # | Method | Path | Priority |
|---|--------|------|----------|
| 1 | GET | `/api/v2/dashboard/summary` | High |
| 2 | POST | `/api/v2/mood` | High |
| 3 | GET | `/api/v2/mood` | High |
| 4 | GET | `/api/v2/mood/weekly-pattern` | Medium |
| 5 | POST | `/api/v2/symptoms` | High |
| 6 | GET | `/api/v2/symptoms` | High |
| 7 | GET | `/api/v2/symptoms/trends` | Medium |
| 8 | GET | `/api/v2/symptoms/tracked` | Low |
| 9 | PUT | `/api/v2/symptoms/tracked` | Low |
| 10 | GET | `/api/v2/appointments` | High |
| 11 | POST | `/api/v2/appointments` | High |
| 12 | PUT | `/api/v2/appointments/{id}` | Medium |
| 13 | DELETE | `/api/v2/appointments/{id}` | Medium |
| 14 | GET | `/api/v2/documents` | High |
| 15 | POST | `/api/v2/documents/upload` | High |
| 16 | GET | `/api/v2/documents/{id}/download` | Medium |
| 17 | DELETE | `/api/v2/documents/{id}` | Medium |
| 18 | GET | `/api/v2/clinical-team` | High |
| 19 | POST | `/api/v2/share-to-clinician` | High |
| 20 | POST | `/api/v2/tests/results` | Medium |
| 21 | GET | `/api/v2/tests/results` | Medium |
| 22 | GET | `/api/v2/tests/trends` | Low |
| 23 | POST | `/api/v2/consent` | High (GDPR) |
| 24 | GET | `/api/v2/consent` | High (GDPR) |
| 25 | GET | `/api/v2/me/export` | High (GDPR) |
| 26 | DELETE | `/api/v2/me` | High (GDPR) |
| 27 | GET | `/api/v2/admin/events` | Medium ✅ |
| 28 | POST | `/api/v2/admin/events` | Medium ✅ |
| 29 | PUT | `/api/v2/admin/events/{id}` | Medium ✅ |
| 30 | DELETE | `/api/v2/admin/events/{id}` | Medium ✅ |
| 31 | GET | `/api/v2/events` | Medium ✅ |
| 32 | GET | `/api/v2/events/{id}` | Medium ✅ |
| 33 | POST | `/api/v2/events/{id}/rsvp` | Medium ✅ |
| 34 | DELETE | `/api/v2/events/{id}/rsvp` | Medium ✅ |

**Total: 34 new endpoints** (15 High priority, 15 Medium, 4 Low)
