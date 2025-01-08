import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const hello = [
  { text: "Hello", flag: "🇺🇸", country: "United States", lang: "English" },
  { text: "Hola", flag: "🇪🇸", country: "Spain", lang: "Spanish" },
  { text: "Bonjour", flag: "🇫🇷", country: "France", lang: "French" },
  { text: "Hallo", flag: "🇩🇪", country: "Germany", lang: "German" },
  { text: "Ciao", flag: "🇮🇹", country: "Italy", lang: "Italian" },
  { text: "こんにちは", flag: "🇯🇵", country: "Japan", lang: "Japanese" },
  { text: "안녕하세요", flag: "🇰🇷", country: "South Korea", lang: "Korean" },
  { text: "你好", flag: "🇨🇳", country: "China", lang: "Chinese" },
  { text: "Olá", flag: "🇵🇹", country: "Portugal", lang: "Portuguese" },
  { text: "Здравствуйте", flag: "🇷🇺", country: "Russia", lang: "Russian" },
  { text: "مرحبا", flag: "🇸🇦", country: "Saudi Arabia", lang: "Arabic" },
  { text: "שלום", flag: "🇮🇱", country: "Israel", lang: "Hebrew" },
  { text: "नमस्ते", flag: "🇮🇳", country: "India", lang: "Hindi" },
  { text: "สวัสดี", flag: "🇹🇭", country: "Thailand", lang: "Thai" },
  { text: "Hej", flag: "🇸🇪", country: "Sweden", lang: "Swedish" },
  { text: "Hei", flag: "🇳🇴", country: "Norway", lang: "Norwegian" },
  { text: "Ahoj", flag: "🇨🇿", country: "Czech Republic", lang: "Czech" },
  { text: "Merhaba", flag: "🇹🇷", country: "Turkey", lang: "Turkish" },
  { text: "Sawubona", flag: "🇿🇦", country: "South Africa", lang: "Zulu" },
  { text: "Xin chào", flag: "🇻🇳", country: "Vietnam", lang: "Vietnamese" },
  { text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", flag: "🇮🇳", country: "India", lang: "Punjabi" },
  { text: "வணக்கம்", flag: "🇮🇳", country: "India", lang: "Tamil" },
  { text: "Γειά σου", flag: "🇬🇷", country: "Greece", lang: "Greek" },
  { text: "გამარჯობა", flag: "🇬🇪", country: "Georgia", lang: "Georgian" },
  { text: "Բարեւ", flag: "🇦🇲", country: "Armenia", lang: "Armenian" },
  { text: "سلام", flag: "🇮🇷", country: "Iran", lang: "Persian" },
  { text: "ሰላም", flag: "🇪🇹", country: "Ethiopia", lang: "Amharic" },
  { text: "ಹಲೋ", flag: "🇮🇳", country: "India", lang: "Kannada" },
  { text: "ഹലോ", flag: "🇮🇳", country: "India", lang: "Malayalam" },
  { text: "హలో", flag: "🇮🇳", country: "India", lang: "Telugu" },
  { text: "Salve", flag: "🇻🇦", country: "Vatican City", lang: "Latin" },
  { text: "Sveiki", flag: "🇱🇻", country: "Latvia", lang: "Latvian" },
  { text: "Tere", flag: "🇪🇪", country: "Estonia", lang: "Estonian" },
  { text: "Aloha", flag: "🇺🇸", country: "Hawaii", lang: "Hawaiian" },
  { text: "Mingalaba", flag: "🇲🇲", country: "Myanmar", lang: "Burmese" },
  { text: "Sawadee", flag: "🇹🇭", country: "Thailand", lang: "Thai" },
  { text: "Kamusta", flag: "🇵🇭", country: "Philippines", lang: "Tagalog" },
  { text: "Selamat", flag: "🇲🇾", country: "Malaysia", lang: "Malay" },
  { text: "Jambo", flag: "🇰🇪", country: "Kenya", lang: "Swahili" },
  { text: "Habari", flag: "🇹🇿", country: "Tanzania", lang: "Swahili" },
  { text: "Sannu", flag: "🇳🇬", country: "Nigeria", lang: "Hausa" },
  { text: "Salam", flag: "🇦🇿", country: "Azerbaijan", lang: "Azerbaijani" },
  { text: "Zdravo", flag: "🇷🇸", country: "Serbia", lang: "Serbian" },
  { text: "Dobrý den", flag: "🇨🇿", country: "Czech Republic", lang: "Czech" },
  { text: "Bok", flag: "🇭🇷", country: "Croatia", lang: "Croatian" },
  { text: "Ahoj", flag: "🇸🇰", country: "Slovakia", lang: "Slovak" },
  {
    text: "Zdravo",
    flag: "🇲🇰",
    country: "North Macedonia",
    lang: "Macedonian",
  },
  { text: "Tashi Delek", flag: "🇧🇹", country: "Bhutan", lang: "Dzongkha" },
  { text: "Saluton", flag: "🌍", country: "Esperanto", lang: "Esperanto" },
  { text: "Hallo", flag: "🇳🇱", country: "Netherlands", lang: "Dutch" },
  { text: "Szia", flag: "🇭🇺", country: "Hungary", lang: "Hungarian" },
];

interface MorphingTextProps {
  className?: string;
}

export const HelloText: React.FC<MorphingTextProps> = ({ className }) => (
  <div
    className={cn(
      "absolute top-2 left-2 leading-none [filter:url(#threshold)_blur(0.6px)] text-5xl opacity-10 hover:opacity-100 transition-opacity duration-500 select-none",
      className,
    )}
  >
    <Texts texts={hello} />
    <SvgFilters />
  </div>
);

const Texts: React.FC<{ texts: typeof hello }> = ({ texts }) => {
  const { text1Ref, text2Ref } = useMorphingText(texts);

  return (
    <>
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        aria-hidden
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text2Ref}
      />
    </>
  );
};

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

const morphTime = 1.5;
const cooldownTime = 1;

const useMorphingText = (texts: typeof hello) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      const text1 = texts[textIndexRef.current % texts.length];
      const text2 = texts[(textIndexRef.current + 1) % texts.length];

      current1.textContent = text1.text;
      current2.textContent = text2.text;
      current2.title = text2.country;
      current2.ariaLabel = `Hello in ${text2.lang}`;
    },
    [texts],
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref };
};
