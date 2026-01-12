# React Query Integration Guide

This project now uses **@tanstack/react-query** (formerly React Query) for all data fetching, caching, and state management.

## Setup

### 1. QueryClient Provider
The `QueryClient` is initialized in `src/main.tsx` and wrapped around the entire app using `QueryClientProvider`. This enables React Query functionality globally.

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

## Custom Hooks (`src/hooks/useApi.ts`)

### useSignups()
Fetches all user signups from `/signups` endpoint.

```tsx
const { data: signups, isLoading, error } = useSignups()
```

### useCreateSignup()
Creates a new signup using a mutation.

```tsx
const createSignupMutation = useCreateSignup()

// Usage in form submission
await createSignupMutation.mutateAsync({
  firstName, lastName, email, password, acceptTerms
})

// Access mutation state
createSignupMutation.isPending  // true while request is in progress
createSignupMutation.isError    // true if error occurred
```

### useCourses()
Fetches all courses from `/courses` endpoint.

```tsx
const { data: courses, isLoading, error } = useCourses()
```

### useCourse(id)
Fetches a single course by ID. Only executes when `id` is provided.

```tsx
const { data: course, isLoading } = useCourse(courseId)
```

## Features

- **Automatic Caching**: Responses are cached automatically, reducing unnecessary API calls
- **Automatic Refetching**: Stale data triggers automatic refetch when relevant
- **Request Deduplication**: Duplicate requests are automatically merged
- **Background Refetching**: Updates happen in the background without blocking UI
- **Query Invalidation**: After mutations, related queries are automatically invalidated

## Where React Query is Used

### 1. Signup Page (`src/pages/Signup.tsx`)
- Uses `useCreateSignup()` mutation for form submission
- Automatically invalidates signups cache after successful creation

### 2. Login Page (`src/pages/Login.tsx`)
- Uses `useSignups()` query to fetch and validate credentials
- Shows loading state while fetching users

### 3. Dashboard Page (`src/pages/Dashboard.tsx`)
- Uses `useCourses()` query to fetch available courses
- Handles loading and error states automatically
- Displays courses in a responsive grid

## Benefits Over Manual Fetch

| Feature | Manual Fetch | React Query |
|---------|-------------|------------|
| Caching | Manual | Automatic |
| Refetching | Manual | Automatic |
| Loading States | Manual | Built-in |
| Error Handling | Manual | Built-in |
| Request Dedup | Manual | Automatic |
| Code Simplicity | Verbose | Concise |

## Running the Project

```bash
# Install dependencies
npm install --prefix ./login

# Terminal 1: Start json-server
npm run db --prefix ./login

# Terminal 2: Start dev server
npm run dev --prefix ./login
```

The project is now fully optimized with React Query for efficient data management! 🚀
