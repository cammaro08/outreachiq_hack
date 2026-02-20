// Apollo integration disabled — uncomment env.ts and this file to re-enable

// import { env } from "../env.js";

// export interface PersonInfo {
//   name: string;
//   title: string | null;
//   email: string | null;
//   linkedinUrl: string | null;
//   company: {
//     name: string | null;
//     domain: string | null;
//     industry: string | null;
//   };
// }

// export async function findPerson(
//   name: string,
//   company: string,
// ): Promise<PersonInfo | null> {
//   const res = await fetch(
//     "https://api.apollo.io/api/v1/mixed_people/api_search",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": env.APOLLO_API_KEY,
//       },
//       body: JSON.stringify({
//         q_keywords: name,
//         q_organization_name: company,
//         per_page: 1,
//         page: 1,
//       }),
//     },
//   );

//   if (!res.ok) {
//     throw new Error(`Apollo API error: ${res.status} ${res.statusText}`);
//   }

//   const data = (await res.json()) as {
//     people?: Array<{
//       name?: string;
//       title?: string;
//       email?: string;
//       linkedin_url?: string;
//       organization?: {
//         name?: string;
//         primary_domain?: string;
//         industry?: string;
//       };
//     }>;
//   };
//   const person = data.people?.[0];

//   if (!person) return null;

//   return {
//     name: person.name ?? name,
//     title: person.title ?? null,
//     email: person.email ?? null,
//     linkedinUrl: person.linkedin_url ?? null,
//     company: {
//       name: person.organization?.name ?? null,
//       domain: person.organization?.primary_domain ?? null,
//       industry: person.organization?.industry ?? null,
//     },
//   };
// }
