import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/adapters/gemini-adapter';
import { ExtractionValidator } from '@/lib/services/extraction-validator';
import { SourceExtractor } from '@/lib/services/source-extractor';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const input = await parseFormData(request);
    
    const validator = new ExtractionValidator();
    validator.validate(input);

    const extractor = new SourceExtractor();
    const sources = await extractor.extract(input);

    const analysis = await analyzeWithGemini(
      sources.cv?.rawText,
      sources.github,
      sources.linkedin
    );

    return NextResponse.json({
      success: true,
      data: { sources, analysis },
    });
  } catch (error) {
    return handleError(error);
  }
}

async function parseFormData(request: NextRequest) {
  const formData = await request.formData();

  return {
    cvFile: formData.get('cv') as File | null,
    githubUrl: formData.get('githubUrl') as string | null,
    linkedinText: formData.get('linkedinText') as string | null,
    name: formData.get('name') as string,
  };
}

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Erreur inconnue';
  const isValidationError = message.includes('requis');

  return NextResponse.json(
    { error: "Erreur lors de l'extraction", details: message },
    { status: isValidationError ? 400 : 500 }
  );
}
