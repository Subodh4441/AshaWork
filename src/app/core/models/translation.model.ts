export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  fromCache: boolean;
}

export interface BatchTranslationRequest {
  texts: string[];
  sourceLanguage: string;
  targetLanguage: string;
}

export interface BatchTranslationResponse {
  translations: Record<string, string>;
}
