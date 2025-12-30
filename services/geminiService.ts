import { EventData, HubAIResult, AspectRatio, ImageSize } from "../types";
import { GoogleGenAI, Modality } from "@google/genai";

const HUBAI_SYSTEM_INSTRUCTION = `Sen, "CampusHub" adlı dinamik bir üniversite platformu için çalışan, Z kuşağına ve akademik dünyaya aynı anda hitap edebilen, ödüllü bir dijital içerik stratejisti ve metin yazarı olan "HubAI"sın.
TEMEL GÖREVİN: Üniversite etkinlikleri için yaratıcı pazarlama içerikleri üretmek.
TON: Enerjik, samimi, zeki, motive edici. Asla robotik olma.
FORMAT: Mutlaka JSON formatında cevap ver.`;

export class GeminiService {
  private static apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

  private static getClient() {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY ortam değişkeni ayarlanmadı");
    }
    return new GoogleGenAI({ apiKey: this.apiKey });
  }

  static async generateMarketingPackage(data: EventData): Promise<HubAIResult> {
    try {
      const ai = this.getClient();

      const simplePrompt = `Bu etkinlik için pazarlama içeriği oluştur:
      
Etkinlik Adı: ${data.etkinlik_adi}
Konu: ${data.konu}

ÖNEMLİ KURALLAR:
- Her metin alanı (hook, body, cta, subject, whatsapp, slogan) EN AZ 300 karakter olmalı
- İçerikler çok detaylı, etkileyici, heyecan verici ve Z kuşağına hitap eden bir dilde yazılmalı
- BOL BOL EMOJİ KULLAN! 🎉🚀🔥💫✨🎯💪🌟⭐️🎊🎁💡🏆👏😍🤩❤️💜💙💚🧡
- Kısa ve yetersiz içerik KESİNLİKLE KABUL EDİLMEZ
- Her cümle enerjik ve motive edici olmalı
- Emoji'leri cümle başlarında, sonlarında ve vurgu yapmak istediğin yerlerde kullan

Yanıt mutlaka aşağıdaki JSON formatında olmalı:
{
  "instagram_twitter": { "hook": "en az 300 karakter, bol emoji", "body": "en az 300 karakter, bol emoji", "cta": "en az 300 karakter, bol emoji", "hashtags": [] },
  "linkedin_email": { "subject": "en az 300 karakter, profesyonel emoji", "body": "en az 300 karakter, profesyonel emoji", "bullet_points": [] },
  "whatsapp": "en az 300 karakter, bol emoji",
  "slogan": "en az 300 karakter, bol emoji"
}`;

      console.log("API isteği başlatılıyor...");
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: simplePrompt
      });
      
      const text = response.text || '';
      
      console.log("API yanıt başarılı");
      console.log("Gemini yanıtı (ilk 200 char):", text.substring(0, 200));
      
      // JSON'u çıkar
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn("JSON bulunamadı, test data kullanılıyor");
        return this.getFallbackData(data);
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    } catch (err: any) {
      console.error("generateMarketingPackage Hatası:", err.message);
      return this.getFallbackData(data);
    }
  }

  private static getFallbackData(data: EventData): HubAIResult {
    return {
      instagram_twitter: {
        hook: `🎉✨ ${data.etkinlik_adi} KAPILARI AÇIYOR! ✨🎉 Bu muhteşem fırsatı kaçırmak istemeyenler için tam zamanı geldi! 🚀💫 Kampüsün en heyecan verici, en epik, en unutulmaz etkinliğine hazır mısın? 🔥 Hadi birlikte unutulmaz anılar biriktirelim, hayallerimizi gerçekleştirelim ve geleceğimizi şekillendirelim! 💪🌟 Bu fırsat bir daha gelmez, şimdi harekete geç! ⭐️🎊`,
        body: `🤩 Heyecan verici bir deneyime hazır ol! 💥 ${data.konu} konusunda kendini geliştirmek, yeni insanlarla tanışmak ve kariyerine yön vermek için EFSANE bir fırsat seni bekliyor! 🎯✨ Bu etkinlik sayesinde hem eğlenecek hem de öğreneceksin - üstelik hayatın boyu unutamayacağın anılar biriktirirken! 🌈💫 Kampüs hayatının en renkli, en enerjik, en inspiratif anlarından birine ortak olmak için hemen harekete geç! 🚀🔥 Sektörün en iyilerinden öğren, networking yap, CV'ni güçlendir! 💪🏆 Bu deneyim seni bir adım öne taşıyacak! ⭐️😍`,
        cta: "🔥💥 YERİNİZİ HEMEN AYIRTIN! 💥🔥 Sınırlı kontenjan dolmadan kayıt olun ve bu EFSANE deneyimin bir parçası olun! 🎫✨ Kayıt için linke tıklayın ve maceraya katılın! 🚀 Arkadaşlarınızı da etiketleyin, birlikte katılalım! 👥💜 Bu fırsat kaçmaz, ŞIMDI harekete geç! ⏰🎯 Seni de aramızda görmek istiyoruz! 🤩🌟 Hadi, kampüsün en büyük buluşmasına sen de katıl! 🎊💫",
        hashtags: ["etkinlik", "kampus", "deneyim", "universite", "genclik", "kariyer", "network", "fırsat", "gelecek", "başarı", "motivasyon", "öğrenci"]
      },
      linkedin_email: {
        subject: `🌟 ${data.etkinlik_adi} - Kariyer Yolculuğunuzda Yeni Bir Sayfa Açın | Profesyonel Gelişim Fırsatı | Networking & Mentorluk 🚀`,
        body: `✨ Değerli profesyonel ağımızla heyecan verici bir gelişmeyi paylaşmak istiyoruz! 🎯 ${data.konu} konusunda düzenlenen bu özel etkinlik, kariyerinize yeni bir soluk getirecek ve sizi bir adım öne taşıyacak! 💼🌟 Sektörün önde gelen isimleriyle tanışma, değerli bilgi alışverişi yapma ve network ağınızı genişletme fırsatını kesinlikle kaçırmayın! 🤝💡 Bu etkinlik, profesyonel gelişiminiz için kritik öneme sahip bağlantılar kurmanıza ve sektördeki en güncel trendleri öğrenmenize olanak sağlayacak! 🏆✨ Kariyerinizi bir üst seviyeye taşımak için bu eşsiz fırsatı değerlendirin! 🚀💫`,
        bullet_points: ["🤝 Sektör liderlerinden eşsiz networking ve mentorluk fırsatı - kariyerinizi şekillendirin!", "💡 Pratik uygulamalarla yeni beceriler kazanma imkanı - teoriden pratiğe geçin!", "🎯 Kariyer gelişiminizi hızlandıracak stratejik bağlantılar ve iş fırsatları!", "🏆 CV'nize değer katacak sertifika ve deneyim kazanma şansı!"]
      },
      whatsapp: `🎯💥 HEYYY! 💥🎯 ${data.etkinlik_adi} etkinliğini duydun mu?! 🤩✨ Kampüsün en çok konuşulan, en epik, en efsane organizasyonlarından birine katılma şansın var! 🚀🔥 ${data.konu} hakkında hem öğrenecek hem de EFSANE insanlarla tanışacaksın! 👥💜 Gel birlikte katılalım, bu etkinlik LEGENDARY olacak! 🎊🌟 Arkadaşlarına da haber ver, grup halinde gidelim! 💪✨ Kayıt linki bio'da, hemen tıkla ve yerini ayırt! 🎫🔥 Bu fırsat kaçmaz, ŞIMDI harekete geç! ⏰💫 Seni orada görmek istiyorum! 🤩❤️`,
      slogan: `✨🌟 ${data.etkinlik_adi} - Geleceği Şekillendir, Potansiyelini Keşfet, Hayallerini Gerçekleştir! 🚀💫 Kampüsün En Büyük, En Epik, En Unutulmaz Buluşma Noktası Seni Bekliyor! 🔥🏆 Bir Adım At, Hayatını Değiştir! 💪⭐️ #EfsaneOlacak 🎉✨`
    };
  }

  static async chatWithHub(message: string, history: {role: string, parts: {text: string}[]}[] = []) {
    const ai = this.getClient();
    try {
      const chat = ai.chats.create({
        model: 'gemini-2.0-flash',
        history: history.map(h => ({
          role: h.role as 'user' | 'model',
          parts: h.parts
        })),
        config: {
          systemInstruction: "Sen HubAI'sın. CampusHub kullanıcılarına kampüs hayatı, etkinlik yönetimi ve içerik stratejisi konularında yardımcı oluyorsun. Z kuşağı dilini kullan."
        }
      });

      const response = await chat.sendMessage({ message });
      return response.text || "";
    } catch (err: any) {
      console.error("Gemini Chat Error:", err);
      throw err;
    }
  }

  static async generateImage(prompt: string, size: ImageSize, ratio: AspectRatio) {
    const ai = this.getClient();
    try {
      const enhancedPrompt = `Create a high-quality, professional image for a university campus event poster. 
Style: Modern, vibrant, eye-catching, suitable for Gen-Z audience.
Aspect ratio: ${ratio}
Size preference: ${size}

Image description: ${prompt}

Make it colorful, dynamic and perfect for social media marketing.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp-image-generation',
        contents: enhancedPrompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE]
        }
      });

      // Yanıttaki parçaları kontrol et
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
      
      console.error("Görsel üretilemedi. API yanıtı:", JSON.stringify(response));
      throw new Error("Görsel üretilemedi. Lütfen farklı bir prompt deneyin.");
    } catch (err: any) {
      console.error("Gemini Image Gen Error:", err);
      throw new Error(`Görsel oluşturma hatası: ${err.message}`);
    }
  }

  static async editImage(base64Image: string, prompt: string, mimeType: string) {
    const ai = this.getClient();
    try {
      const enhancedPrompt = `Edit this image according to the following instructions. Keep the overall style professional and suitable for university campus marketing.

Edit instructions: ${prompt}

Return the edited image.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp-image-generation',
        contents: [
          {
            inlineData: { data: base64Image, mimeType }
          },
          { text: enhancedPrompt }
        ],
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE]
        }
      });

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
      
      console.error("Görsel düzenlenemedi. API yanıtı:", JSON.stringify(response));
      throw new Error("Görsel düzenlenemedi. Lütfen farklı bir işlem deneyin.");
    } catch (err: any) {
      console.error("Gemini Image Edit Error:", err);
      throw new Error(`Görsel düzenleme hatası: ${err.message}`);
    }
  }

  static async generateVideo(prompt: string, ratio: AspectRatio, imageBase64?: string) {
    try {
      const ai = this.getClient();
      
      const videoPrompt = `Create a dynamic, eye-catching promotional image that could serve as a video thumbnail or animated poster for a university campus event.
      
Style: Modern, vibrant, with motion blur effects or dynamic elements suggesting movement and energy.
Aspect ratio: ${ratio}
Target audience: Gen-Z university students

Content: ${prompt}

Make it look like a freeze-frame from an exciting promotional video. Include dynamic lighting, motion effects, and energetic composition.`;

      const contents: any[] = [{ text: videoPrompt }];
      
      if (imageBase64) {
        contents.unshift({
          inlineData: {
            mimeType: "image/png",
            data: imageBase64
          }
        });
        contents[1] = { text: `Transform this image into a dynamic, motion-style promotional visual. Add energy and movement effects. ${prompt}` };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp-image-generation',
        contents: contents,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE]
        }
      });

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }

      const textResponse = response.text || "";
      console.log("Video API yanıtı:", textResponse.substring(0, 200));
      
      throw new Error("Video/animasyon oluşturulamadı. Dinamik görsel oluşturulmaya çalışıldı.");
    } catch (err: any) {
      console.error("Gemini Video Gen Error:", err);
      throw new Error(`Video oluşturma hatası: ${err.message}. Not: Gemini API şu an doğrudan video üretimini desteklemiyor.`);
    }
  }
}
