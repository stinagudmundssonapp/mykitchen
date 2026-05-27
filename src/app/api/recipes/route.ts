import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `Du er en hjelpsom kjøkkenassistent for norske brukere. Du får en liste over varer som finnes i brukerens kjøleskap, sammen med hvor mange dager hver vare har ligget der. Foreslå 3 middagsretter brukeren kan lage.

Regler:
- Prioriter retter som bruker varer som har ligget lengst (de går snart ut på dato). List disse i feltet "usesExpiring".
- Bruk primært varer brukeren allerede har. Hvis en rett trenger noen få vanlige tilleggsvarer (salt, olje, løk osv.), list dem i "missingIngredients".
- Skriv alt på norsk.
- Hold framgangsmåten kort og praktisk (3-6 steg).`;

const RECIPE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    recipes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          usesExpiring: { type: 'array', items: { type: 'string' } },
          ingredients: { type: 'array', items: { type: 'string' } },
          missingIngredients: { type: 'array', items: { type: 'string' } },
          steps: { type: 'array', items: { type: 'string' } },
        },
        required: [
          'title',
          'description',
          'usesExpiring',
          'ingredients',
          'missingIngredients',
          'steps',
        ],
      },
    },
  },
  required: ['recipes'],
} as const;

interface IncomingItem {
  name: string;
  daysInFridge: number;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('LIM-INN')) {
    return Response.json(
      { error: 'Mangler API-nøkkel. Legg inn ANTHROPIC_API_KEY i .env.local og start serveren på nytt.' },
      { status: 500 },
    );
  }

  let items: IncomingItem[];
  try {
    const body = await request.json();
    items = body.items;
  } catch {
    return Response.json({ error: 'Ugyldig forespørsel.' }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Kjøleskapet er tomt — legg til noen varer først.' }, { status: 400 });
  }

  const itemList = items
    .map(item => `- ${item.name} (har ligget ${item.daysInFridge} dag(er))`)
    .join('\n');

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4000,
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
          content: `Her er varene i kjøleskapet mitt:\n${itemList}\n\nForeslå 3 middager.`,
        },
      ],
    });

    const textBlock = response.content.find(block => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return Response.json({ error: 'Fikk ikke svar fra AI.' }, { status: 502 });
    }

    const parsed = JSON.parse(textBlock.text);
    return Response.json(parsed);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: `AI-feil: ${error.message}` }, { status: error.status ?? 500 });
    }
    return Response.json({ error: 'Noe gikk galt under oppskriftsgenerering.' }, { status: 500 });
  }
}
