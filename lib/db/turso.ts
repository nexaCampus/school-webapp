import { createClient } from '@libsql/client';

const TURSO_DATABASE_URL =
  process.env.TURSO_DATABASE_URL ||
  'libsql://nexa-campus-parthasdey2304.aws-ap-south-1.turso.io';

const TURSO_AUTH_TOKEN =
  process.env.TURSO_AUTH_TOKEN ||
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTI3NDQxMDQsImlkIjoiMDFhMTQ0NzEtOWIwMS03MTM3LThhMjEtYWZjYjU5YzM4Y2NiIiwia2lkIjoiNm01MU5ocWZzWFgxUWFyQlFVcHZ1eGhvTmxZcEhyYXA0VXU4STdsaTFWRSIsInJpZCI6IjdiZDJlZWM3LWNjODctNDA4Mi1hMWRmLTNmODBiZDFiZTI3MSJ9.78XD4RBXwhjx0Hr2AjHVDLMzqGGDGOKwy1ZtunXvFLzU0aM64c2UOc1S1vcHVHy6k5PtVinCms5HYp67l5DlAg';

export const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export default turso;
