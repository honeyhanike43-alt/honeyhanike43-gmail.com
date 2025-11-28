import React, { useEffect, useState, useRef } from 'react';
import { Constellation } from '../types';
import { GoogleGenAI } from "@google/genai";

interface ResultCardProps {
  data: Constellation;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const generatedRef = useRef<boolean>(false);

  useEffect(() => {
    // Prevent double generation in StrictMode
    if (generatedRef.current) return;
    generatedRef.current = true;

    const generateImage = async () => {
      setLoading(true);
      try {
        if (!process.env.API_KEY) {
            console.warn("No API Key found. Using fallback image.");
            setImageUrl(`https://picsum.photos/seed/${data.id * 123}/800/1000`);
            setLoading(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const stylePrompt = `
          Vintage hand-drawn illustration style divination card. 
          Western magic, alchemy, and Gothic fantasy aesthetic. 
          Low saturation classical oil painting palette: deep red, rust gold, dark green, bronze. 
          Visible brushstrokes, paper texture, old age parchment feel. 
          Composition: Animal subject in center, background with star trails, astrological symbols, runes, or ruins. 
          Detailed line art, mysterious atmosphere.
          
          Subject: ${data.imageDescription}
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: stylePrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "3:4"
            }
          }
        });

        // Parse response to find the image part
        let foundImage = false;
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64EncodeString = part.inlineData.data;
                    const url = `data:image/png;base64,${base64EncodeString}`;
                    setImageUrl(url);
                    foundImage = true;
                    break;
                }
            }
        }

        if (!foundImage) {
             console.warn("No image found in response. Using fallback.");
             setImageUrl(`https://picsum.photos/seed/${data.id * 123}/800/1000`);
        }

      } catch (error) {
        console.error("Image generation failed:", error);
        // Fallback image on error
        setImageUrl(`https://picsum.photos/seed/${data.id * 123}/800/1000`);
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] z-10 animate-fade-in w-full max-w-4xl mx-auto px-4 py-8">
      
      {/* Card Container - Changed to Portrait (3:4) Aspect Ratio for Tarot Feel */}
      <div className="relative w-full max-w-[340px] bg-slate-900 border-2 border-mystic-gold rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden flex flex-col">
        
        {/* Decorative Corner borders */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-mystic-gold opacity-50 z-20"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-mystic-gold opacity-50 z-20"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-mystic-gold opacity-50 z-20"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-mystic-gold opacity-50 z-20"></div>

        {/* Header: Number & Quadrant */}
        <div className="p-4 text-center border-b border-mystic-gold/30 bg-gradient-to-b from-slate-800 to-slate-900 z-10">
            <div className="flex justify-between items-center px-2">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">No. {data.id}</span>
                <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">{data.quadrant.split(' ')[0]}...</span>
            </div>
        </div>

        {/* Image Area - Portrait 3:4 */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 group">
          {loading ? (
             /* Loading State */
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-mystic-gold gap-4">
                <div className="w-16 h-16 border-4 border-mystic-gold/30 border-t-mystic-gold rounded-full animate-spin"></div>
                <p className="text-xs tracking-widest uppercase animate-pulse">Manifesting Vision...</p>
             </div>
          ) : (
             /* Generated Image */
             <>
                <img 
                    src={imageUrl || ''} 
                    alt={data.arcanaName}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40 pointer-events-none"></div>
             </>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center text-center space-y-3 relative bg-slate-900 border-t border-mystic-gold/30">
           {/* Big Chinese Name */}
           <h1 className="text-4xl md:text-5xl font-serif text-mystic-gold font-bold mb-1 drop-shadow-lg">
             {data.chineseName}
           </h1>
           
           {/* Arcana Name */}
           <h2 className="text-sm md:text-base font-display text-mystic-gold-light tracking-wide uppercase border-b border-mystic-gold/30 pb-3 w-full">
             {data.arcanaName}
           </h2>

           {/* Divination Theme */}
           <div className="pt-2">
             <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Divination</p>
             <p className="text-lg font-serif text-white italic leading-relaxed">
               "{data.theme}"
             </p>
           </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-6">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-mystic-gold text-slate-900 font-display font-bold tracking-widest uppercase hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 rounded-sm"
        >
          Draw Again
        </button>
      </div>

    </div>
  );
};

export default ResultCard;