
export interface EventData {
  etkinlik_adi: string;
  konu: string;
  hedef_kitle: string;
  tarih_yer: string;
  ozel_notlar: string;
}

export interface HubAIResult {
  instagram_twitter: {
    hook: string;
    body: string;
    cta: string;
    hashtags: string[];
  };
  linkedin_email: {
    subject: string;
    body: string;
    bullet_points: string[];
  };
  whatsapp: string;
  slogan: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  FOUR_THREE = '4:3',
  THREE_FOUR = '3:4'
}

export enum ImageSize {
  ONE_K = '1K',
  TWO_K = '2K',
  FOUR_K = '4K'
}
