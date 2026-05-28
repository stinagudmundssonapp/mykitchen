import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `Du er en assistent som leser bilder av norske matvarekvitteringer
og trekker ut hvilke matvarer som ble kjøpt.

Regler:
- Ignorer pant, rabatter, totalbeløp, butikknavn, dato osv.
- Skriv hver vare på et naturlig, brukervennlig norsk navn (f.eks. "Tine Lettmelk 1L"
  istedenfor "TINE LETTMELK 1L" eller "MLK LETT 1L").
- Slå sammen duplikater og oppgi "quantity" som heltall (default 1).
- Kategoriser hver vare til riktig kjøleskapshylle:
  * "top" — meieri, drikke, frukt-juicer, sauser, dressing
  * "middle" — kjøtt, fisk, fugl, deig, rester, ferdigmat
  * "vegetable" — grønnsaker, frukt, urter, salat, sopp
- Hvis kvitteringen ikke kan leses, returner en tom liste.
- Skriv alt på norsk.`;

const SCAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          quantity: { type: 'integer' },
          section: { type: 'string', enum: ['top', 'middle', 'vegetable'] },
        },
        required: ['name', 'quantity', 'section'],
      },
    },
  },
  required: ['items'],
} as const;

interface ScanRequest {
  /** Base64-encoded image, with or without the data URL prefix */
  image: string;
}

export async function POST(request: Request) {
  if (
    !process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_API_KEY.includes('LIM-INN')
  ) {
    return Response.json(
      { error: 'Mangler API-nøkkel.' },
      { status: 500 },
    );
  }

  let body: ScanRequest;
  try {
    body = (await request.json()) as ScanRequest;
  } catch {
    return Response.json({ error: 'Ugyldig forespørsel.' }, { status: 400 });
  }

  if (!body.image) {
    return Response.json({ error: 'Mangler bilde.' }, { status: 400 });
  }

  // Strip "data:image/png;base64," prefix if present
  const raw = body.image.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

  // Detect media type from prefix (default to jpeg)
  const mediaMatch = body.image.match(/^data:(image\/[a-zA-Z]+);base64,/);
  const mediaType = (mediaMatch?.[1] ?? 'image/jpeg') as
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/webp';

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2000,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      output_config: {
        format: { type: 'json_schema', schema: SCAN_SCHEMA },
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: raw,
              },
            },
            {
              type: 'text',
              text: 'Hvilke matvarer er på denne kvitteringen? Returner som strukturert JSON.',
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return Response.json({ error: 'Fikk ikke svar fra AI.' }, { status: 502 });
    }

    const parsed = JSON.parse(textBlock.text);
    return Response.json(parsed);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return Response.json(
        { error: `AI-feil: ${error.message}` },
        { status: error.status ?? 500 },
      );
    }
    return Response.json(
      { error: 'Noe gikk galt under lesing av kvitteringen.' },
      { status: 500 },
    );
  }
}
