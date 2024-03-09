export default async function onRequest(context: any) {
  // Serialize the entire context.env
  const envData = process.env;

  return new Response(JSON.stringify({ env: envData }), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

export const runtime = "edge";
