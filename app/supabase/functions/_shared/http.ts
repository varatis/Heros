// HeroBook Edge Functions — helpers HTTP partagés

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function fail(code: string, message: string, status: number): Response {
  return json({ error: code, message }, status);
}

/**
 * Gère la pré-vol CORS + la méthode.
 * Retourne une Response si la requête doit être court-circuitée.
 */
export function preflight(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return fail("method_not_allowed", "Utilisez POST", 405);
  }
  return null;
}
