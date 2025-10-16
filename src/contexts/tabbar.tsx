import { useEffect, useState, useRef, useCallback } from "react";

enum TitleState {
    Idle,
    Away,
    Focused,
    Blurred,
};

enum EmotionalStage {
    Sad = 0,
    Angry = 1,
    Mad = 2,
    Crazy = 3,
    GiveUp = 4,
    StartOver = 5,
};

// Different emotional flows/stories - more human, less robotic
const EMOTIONAL_FLOWS = [
    // Flow 1: Thoughtful reflection
    [
        ["Hmm, where did you go?", "Taking a little break?", "Missed seeing you here"],
        ["Getting a bit lonely over here", "Hope everything's okay", "You know I miss you"],
        ["This is starting to feel weird", "Come on back when you can", "I get it, life's busy"],
        ["Okay, now I'm just confused", "Are you coming back soon?", "This feels strange"],
        ["I think I get the message", "Take your time, no rush", "I'll be here when you return"],
        ["Oh hey, welcome back!", "Good to see you again", "Let's pick up where we left off"],
    ],
    // Flow 2: Casual conversation
    [
        ["Hey, stepped away for a sec?", "Everything alright?", "Just checking in"],
        ["Starting to wonder about you", "Hope you're not stuck somewhere", "You doing okay?"],
        ["This is taking longer than expected", "Getting a little concerned", "You know how I worry"],
        ["Okay, now I'm pacing a bit", "Should I be worried?", "Come back and tell me you're fine"],
        ["I guess you need your space", "I'll try not to overthink it", "Take care of yourself first"],
        ["There you are! All good?", "Glad you're back safe", "What's new with you?"],
    ],
    // Flow 3: Friendly banter
    [
        ["Out for a quick errand?", "Don't be gone too long", "I'll be right here"],
        ["Getting curious about what you're up to", "Having fun without me?", "Share the story later"],
        ["Alright, this is taking forever", "You better have a good reason", "I'm starting to get impatient"],
        ["Now I'm just being dramatic", "But seriously, where are you?", "This isn't funny anymore"],
        ["Fine, I give up for now", "But don't make this a habit", "I'll try not to hold it against you"],
        ["Oh! You came back!", "I knew you'd return eventually", "Now tell me everything"],
    ],
];

// Occasional teasing messages when idle - more subtle and human
const IDLE_TEASES = [
    "Nice work today",
    "You're doing great",
    "Keep it up!",
    "Really enjoying this",
    "Thanks for visiting",
    "Glad you found this",
    "This is pretty cool",
    "Love seeing you here",
];

const BASE_TITLE = "rajaniraiyn.dev";
const BASE_EMOJI = "👋";

// Emoji mapping for emotional states
const EMOJI_MAP = {
    [EmotionalStage.Sad]: ["😔", "🥺", "😕"],
    [EmotionalStage.Angry]: ["😤", "😒", "🙄"],
    [EmotionalStage.Mad]: ["😠", "😤", "💢"],
    [EmotionalStage.Crazy]: ["😵", "🤯", "🌀"],
    [EmotionalStage.GiveUp]: ["😔", "😞", "😴"],
    [EmotionalStage.StartOver]: ["😊", "🙂", "✨"],
};

// Check if there's any playing media that we should respect
const isMediaPlaying = (): boolean => {
    const mediaElements = [
        ...document.querySelectorAll('audio'),
        ...document.querySelectorAll('video')
    ] as (HTMLAudioElement | HTMLVideoElement)[];

    return mediaElements.some(media => !media.paused && !media.muted && media.currentTime > 0);
};

export function TabBarProvider() {
    const [titleState, setTitleState] = useState<TitleState>(
        document.visibilityState === "visible" ? TitleState.Focused : TitleState.Blurred
    );
    const [switchCount, setSwitchCount] = useState(0);
    const [currentFlow, setCurrentFlow] = useState(0);
    const [currentTitle, setCurrentTitle] = useState(BASE_TITLE);
    const [currentEmoji, setCurrentEmoji] = useState<string | null>(null);

    // Centralized timer management
    const timersRef = useRef<Set<number>>(new Set());

    // Cleanup function for all timers
    const cleanupTimers = useCallback(() => {
        timersRef.current.forEach(timerId => {
            clearTimeout(timerId);
            clearInterval(timerId);
        });
        timersRef.current.clear();
    }, []);

    // Safe timer functions that track cleanup
    const setTrackedTimeout = useCallback((callback: () => void, delay: number) => {
        const timerId = window.setTimeout(() => {
            timersRef.current.delete(timerId);
            callback();
        }, delay);
        timersRef.current.add(timerId);
        return timerId;
    }, []);

    const setTrackedInterval = useCallback((callback: () => void, delay: number) => {
        const timerId = window.setInterval(callback, delay);
        timersRef.current.add(timerId);
        return timerId;
    }, []);

    // State management function that handles all tab state transitions
    const updateTabState = useCallback(() => {
        const isVisible = document.visibilityState === "visible";
        const hasFocus = document.hasFocus();

        let newState: TitleState;

        if (isVisible && hasFocus) {
            newState = TitleState.Focused;
        } else if (isVisible && !hasFocus) {
            newState = TitleState.Idle;
        } else {
            newState = TitleState.Away;
        }

        setTitleState(newState);

        // Reset counters when returning to active states
        if (newState === TitleState.Focused || newState === TitleState.Idle) {
            setSwitchCount(0);
            setCurrentFlow(Math.floor(Math.random() * EMOTIONAL_FLOWS.length));
        } else if (newState === TitleState.Away) {
            setSwitchCount(prev => prev + 1);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        // Listen to multiple events for comprehensive tab state tracking
        const events = ['visibilitychange', 'focus', 'blur', 'beforeunload'];

        events.forEach(event => {
            document.addEventListener(event, updateTabState, { signal: controller.signal });
        });

        // Also listen to window focus/blur events
        window.addEventListener('focus', updateTabState, { signal: controller.signal });
        window.addEventListener('blur', updateTabState, { signal: controller.signal });

        return () => {
            controller.abort();
            cleanupTimers();
        };
    }, [updateTabState, cleanupTimers]);

    // Handle title and emoji updates based on state
    useEffect(() => {
        // Clear all existing timers before setting up new ones
        cleanupTimers();

        if (titleState === TitleState.Away) {
            const stage = Math.min(Math.floor(switchCount / 3), EmotionalStage.StartOver);
            const messages = EMOTIONAL_FLOWS[currentFlow][stage];

            // Update emoji based on emotional state (sometimes no emoji for subtlety)
            if (Math.random() < 0.7) { // 70% chance to show emoji
                const emojis = EMOJI_MAP[stage as EmotionalStage];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                setCurrentEmoji(randomEmoji);
            } else {
                setCurrentEmoji(null);
            }

            let messageCycleIndex = 0;
            setCurrentTitle(messages[messageCycleIndex]);

            // Use tracked interval for message cycling
            setTrackedInterval(() => {
                messageCycleIndex = (messageCycleIndex + 1) % messages.length;
                setCurrentTitle(messages[messageCycleIndex]);
            }, 2000 + Math.random() * 1000);

        } else if (titleState === TitleState.Focused || titleState === TitleState.Idle) {
            // Don't interrupt title if media is playing
            if (!isMediaPlaying()) {
                setCurrentTitle(BASE_TITLE);
            }

            // Subtle emoji chance when focused (and no media playing)
            if (titleState === TitleState.Focused && !isMediaPlaying() && Math.random() < 0.2) {
                setCurrentEmoji("🙂");
            } else {
                setCurrentEmoji(null);
            }

            // Occasional teasing when idle (not focused and no media playing)
            if (titleState === TitleState.Idle && !isMediaPlaying()) {
                const scheduleRandomTease = () => {
                    if (titleState === TitleState.Idle && !isMediaPlaying()) {
                        if (Math.random() < 0.1) { // 10% chance
                            const teaseMessage = IDLE_TEASES[Math.floor(Math.random() * IDLE_TEASES.length)];
                            const originalTitle = currentTitle;
                            setCurrentTitle(teaseMessage);

                            setTrackedTimeout(() => {
                                // Double-check we're still in idle state and no media is playing before reverting
                                if (titleState === TitleState.Idle && !isMediaPlaying()) {
                                    setCurrentTitle(originalTitle);
                                }
                            }, 2500);
                        }
                    }

                    // Schedule next tease attempt
                    setTrackedTimeout(scheduleRandomTease, 15000 + Math.random() * 15000);
                };

                setTrackedTimeout(scheduleRandomTease, 15000 + Math.random() * 15000);
            }
        }
    }, [titleState, switchCount, currentFlow, currentTitle, cleanupTimers, setTrackedInterval, setTrackedTimeout]);

    return (
        <>
            <title>{currentTitle}</title>
            <EmojiFavicon emoji={currentEmoji || BASE_EMOJI} />
        </>
    );
}

function EmojiFavicon({ emoji }: { emoji: string }) {
    const svgText = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <text
        x="50" y="55"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="80"
        font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif"
    >${emoji}</text>
</svg>`;

    return <link rel="icon" href={`data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`} />;
}