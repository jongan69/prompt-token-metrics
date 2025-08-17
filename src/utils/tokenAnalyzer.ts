export interface TokenData {
  token: string;
  frequency: number;
}

export interface AnalysisResult {
  totalTokens: number;
  uniqueTokens: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgTokenLength: number;
  avgTokensPerSentence: number;
  specialCharCount: number;
  whitespaceCount: number;
  tokenLengthDistribution: number[];
  topTokens: TokenData[];
}

export class TokenAnalyzer {
  private readonly specialCharRegex = /[^\w\s]/g;
  private readonly whitespaceRegex = /\s/g;
  private readonly sentenceEndRegex = /[.!?]+/g;
  private readonly paragraphRegex = /\n\s*\n/;

  analyze(text: string): AnalysisResult {
    const tokens = this.tokenize(text);
    const tokenFrequency = this.calculateTokenFrequency(tokens);
    const tokenLengthDist = this.calculateTokenLengthDistribution(tokens);

    return {
      totalTokens: tokens.length,
      uniqueTokens: Object.keys(tokenFrequency).length,
      wordCount: this.countWords(text),
      sentenceCount: this.countSentences(text),
      paragraphCount: this.countParagraphs(text),
      avgTokenLength: this.calculateAverageTokenLength(tokens),
      avgTokensPerSentence: tokens.length / Math.max(1, this.countSentences(text)),
      specialCharCount: this.countSpecialChars(text),
      whitespaceCount: this.countWhitespace(text),
      tokenLengthDistribution: tokenLengthDist,
      topTokens: this.getTopTokens(tokenFrequency, 20),
    };
  }

  private tokenize(text: string): string[] {
    // Simplified GPT-style tokenization
    // Split on whitespace and punctuation, then apply subword segmentation
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' $& ')
      .split(/\s+/)
      .filter(token => token.length > 0);

    const tokens: string[] = [];

    for (const word of words) {
      if (word.length <= 4) {
        tokens.push(word);
      } else {
        // Simulate BPE-style subword tokenization for longer words
        const subwords = this.subwordTokenize(word);
        tokens.push(...subwords);
      }
    }

    return tokens;
  }

  private subwordTokenize(word: string): string[] {
    if (word.length <= 4) return [word];
    
    const subwords: string[] = [];
    let remaining = word;
    
    while (remaining.length > 0) {
      // Find the longest common subword (simplified approach)
      let tokenLength = Math.min(6, remaining.length);
      
      // Prefer breaking at natural boundaries
      if (remaining.length > tokenLength) {
        const vowels = 'aeiou';
        for (let i = tokenLength - 1; i >= 2; i--) {
          if (vowels.includes(remaining[i]) && !vowels.includes(remaining[i + 1])) {
            tokenLength = i + 1;
            break;
          }
        }
      }
      
      subwords.push(remaining.substring(0, tokenLength));
      remaining = remaining.substring(tokenLength);
    }
    
    return subwords;
  }

  private calculateTokenFrequency(tokens: string[]): Record<string, number> {
    const frequency: Record<string, number> = {};
    
    for (const token of tokens) {
      frequency[token] = (frequency[token] || 0) + 1;
    }
    
    return frequency;
  }

  private calculateTokenLengthDistribution(tokens: string[]): number[] {
    const maxLength = 20;
    const distribution = new Array(maxLength).fill(0);
    
    for (const token of tokens) {
      const length = Math.min(token.length, maxLength) - 1;
      distribution[length]++;
    }
    
    return distribution;
  }

  private calculateAverageTokenLength(tokens: string[]): number {
    if (tokens.length === 0) return 0;
    
    const totalLength = tokens.reduce((sum, token) => sum + token.length, 0);
    return totalLength / tokens.length;
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private countSentences(text: string): number {
    const sentences = text.split(this.sentenceEndRegex);
    return Math.max(1, sentences.filter(s => s.trim().length > 0).length);
  }

  private countParagraphs(text: string): number {
    const paragraphs = text.split(this.paragraphRegex);
    return Math.max(1, paragraphs.filter(p => p.trim().length > 0).length);
  }

  private countSpecialChars(text: string): number {
    const matches = text.match(this.specialCharRegex);
    return matches ? matches.length : 0;
  }

  private countWhitespace(text: string): number {
    const matches = text.match(this.whitespaceRegex);
    return matches ? matches.length : 0;
  }

  private getTopTokens(frequency: Record<string, number>, limit: number): TokenData[] {
    return Object.entries(frequency)
      .map(([token, freq]) => ({ token, frequency: freq }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }
}