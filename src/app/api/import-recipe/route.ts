import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `Du får en HTML-side med en norsk oppskrift (typisk matprat.no, godt.no,
trines-matblogg, oppskrift.no eller lignende). Din jobb er å trekke ut oppskriften
i strukturert form.

Regler:
- "title" — kort, naturlig norsk navn på retten.
- "description" — 1-2 setninger, kort sammendrag.
- "timeMinutes" — total tilberedningstid som tall.
- "servings" — antall porsjoner.
- "ingredients" — én streng per ingrediens, inkludert mengde (f.eks. "500g kyllingfilet").
- "steps" — én streng per steg, kort og praktisk.
- "tags" — 2-4 tags som beskriver retten (f.eks. "Italiensk", "Vegetar", "Rask").
- Ignorer reklame, kommentarer, relaterte oppskrifter.
- Hvis siden ikke ser ut til å inneholde en oppskrift, returner alle felter tomme/0.
- Skriv alt på norsk.`;

const RECIPE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    timeMinutes: { type: 'integer' },
    servings: { type: 'integer' },
    ingredients: { type: 'array', items: { type: 'string' } },
    steps: { type: 'array', items: { type: 'string' } },
    tags: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'title',
    'description',
    'timeMinutes',
    'servings',
    'ingredients',
    'steps',
    'tags',
  ],
} as const;

interface ImportRequest {
  url: string;
}

const ALLOWED_HOSTS = [
  'matprat.no',
  'godt.no',
  'oppskrift.no',
  'trinesmatblogg.no',
  'meny.no',
  'kiwi.no',
  'rema.no',
  'coop.no',
];

export async function POST(request: Request) {
  if (
    !process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_KEY.includes('LIM-INN')
  ) {
    return Response.json({ error: 'Mangler API-nøkkel.' }, { status: 500 });
  }

  let body: ImportRequest;
  try {
    body = (await request.json()) as ImportRequest;
  } catch {
    return Response.json({ error: 'Ugyldig forespørsel.' }, { status: 400 });
  }

  if (!body.url) {
    return Response.json({ error: 'Mangler URL.' }, { status: 400 });
  }

  // Validate URL
  let parsed: URL;
  try {
    parsed = new URL(body.url);
  } catch {
    return Response.json(
      { error: 'URL-en er ikke gyldig. Sjekk at den starter med https://' },
      { status: 400 },
    );
  }

  // Soft-warn if not a known recipe host (still attempt, but flag)
  const hostKnown = ALLOWED_HOSTS.some((h) => parsed.hostname.endsWith(h));

  // Fetch the page HTML
  let html: string;
  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        // Pretend to be a regular browser to avoid bot blocks
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'Accept-Language': 'nb-NO,nb;q=0.9,en;q=0.8',
      },
      // Some sites are slow
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      return Response.json(
        { error: `Klarte ikke å hente siden (${res.status}).` },
        { status: 502 },
      );
    }
    html = await res.text();
  } catch {
    return Response.json(
      { error: 'Klarte ikke å hente siden. Sjekk at URL-en fungerer.' },
      { status: 502 },
    );
  }

  // Strip scripts/styles/svgs and trim length to keep token usage reasonable
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120_000);

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 3000,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      output_config: {
        format: { type: 'json_schema', schema: RECIPE_SCHEMA },
      },
      messages: [
        {
          role: 'user',
          content: `URL: ${parsed.toString()}\n\nHTML-innhold:\n\n${stripped}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return Response.json({ error: 'Fikk ikke svar fra AI.' }, { status: 502 });
    }

    const parsedRecipe = JSON.parse(textBlock.text);
    if (!parsedRecipe.title) {
      return Response.json(
        {
          error: hostKnown
            ? 'Fant ingen oppskrift på siden.'
            : 'Fant ingen oppskrift. Dette domenet er ikke testet — prøv matprat.no eller godt.no.',
        },
        { status: 422 },
      );
    }
    return Response.json({
      recipe: parsedRecipe,
      source: parsed.hostname.replace(/^www\./, ''),
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return Response.json(
        { error: `AI-feil: ${error.message}` },
        { status: error.status ?? 500 },
      );
    }
    return Response.json(
      { error: 'Noe gikk galt under tolkning av oppskriften.' },
      { status: 500 },
    );
  }
}
