import type { Database } from "../database.types";
import { createClient } from "@supabase/supabase-js";

export const client = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://eluizbgtbizpeinyirzv.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdWl6Ymd0Yml6cGVpbnlpcnp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTc1MjgwMiwiZXhwIjoyMDE3MzI4ODAyfQ._3-bTvf_AjEXo3J3hZIznSQQyNoE875dMvbIqm2Lu04"
);

type Endpoint = {
  user_id?: string;
  prover_name: string;
  prover_url: string;
  prover_fee: number;
};

export async function getEndpoints() {
  const { data, error } = await client.from("prover_market").select("*");

  return data;
}

export async function addEndpoint(endpoint: Endpoint) {
  let session = await client.auth.getSession();

  if (!session) {
    console.error("User must be logged in to insert data");
    return;
  }

  // Add the user_id to the endpoint data
  const endpointWithUserId = {
    ...endpoint,
    user_id: session.data.session.user.id,
  };

  const { data, error } = await client
    .from("prover_market")
    .insert([endpointWithUserId]);

  return data;
}
/**
 * Edit endpoint in database (Must be authorized, logged into github)
 */
export async function editEndpoint(endpoint: Endpoint) {
  let session = await client.auth.getSession();

  if (!session) {
    console.error("User must be logged in to insert data");
    return;
  }

  const { data, error } = await client
    .from("prover_market")
    .update(endpoint)
    .match({ user_id: session.data.session.user.id });

  if (error) {
    return error;
  }

  return data;
}
