# Implement Job Persistence with Database

Currently, jobs are hardcoded in `app/jobs/data.ts`. This plan will connect the `JobCreationForm` and the `/jobs` page to the SQLite database using Drizzle ORM, making the job portal fully functional.

## Proposed Changes

### 1. Database Schema
#### [MODIFY] [schema.ts](file:///c:/Users/Rohit/OneDrive/Desktop/siliconfriends/db/schema.ts)
- Add a new `job` table schema.
- Fields will correspond to the `JobFormState`, including `title`, `company`, `location`, `salary`, `description`, etc.
- Include a `createdBy` field referencing `user.id`.

### 2. Server Actions
#### [NEW] [actions/job.ts](file:///c:/Users/Rohit/OneDrive/Desktop/siliconfriends/actions/job.ts)
- `createJob(data)`: A Next.js server action to insert a new job into the database.
- `getJobs()`: A server action to fetch all jobs from the database.

### 3. Frontend Refactoring
#### [NEW] [JobsClient.tsx](file:///c:/Users/Rohit/OneDrive/Desktop/siliconfriends/app/jobs/JobsClient.tsx)
- Move the current client-side logic from `app/jobs/page.tsx` into this new client component.
- Accept an `initialJobs` prop to render the jobs from the database.
- If the `initialJobs` array is empty, display a "Currently jobs are not available" message.

#### [MODIFY] [page.tsx](file:///c:/Users/Rohit/OneDrive/Desktop/siliconfriends/app/jobs/page.tsx)
- Convert the page into a React Server Component.
- Fetch the jobs securely from the database using Drizzle.
- Pass the fetched jobs to the `JobsClient` component.

#### [MODIFY] [JobCreationForm.tsx](file:///c:/Users/Rohit/OneDrive/Desktop/siliconfriends/app/components/JobCreationForm.tsx)
- Update the `handleSubmit` function to call the `createJob` server action instead of mocking the delay.
- Once the action succeeds, close the modal and refresh the router to show the newly created job.

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
1. Run Drizzle migrations to apply the schema changes to the database.
2. Navigate to the `/jobs` portal and verify it shows the "No jobs available" empty state.
3. Use the **Create Job** modal to submit a new job.
4. Verify the new job appears on the dashboard immediately.
