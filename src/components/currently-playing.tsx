import { useMouseMotionValue } from "@/hooks/use-mouse";
import { cn } from "@/lib/utils";
import { queryClient } from "@/store";
import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { Mic2, Music, Music2, Music3, Music4 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { AudioLinesIcon } from "./ui/audio-lines";
import { LinkPreview } from "./ui/link-preview";

const PARTIAL_THRESHOLD = 100;

export function CurrentlyPlaying() {
  const { data: currentlyPlayingTrack, refetch: refetchCurrentlyPlayingTrack } =
    useQuery(
      {
        queryKey: ["currently-playing"],
        queryFn: async () => {
          const { data } = await actions.spotify.getCurrentlyPlayingTrack({});
          return data;
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: false,
        refetchInterval: 30e3, // 30s
      },
      queryClient,
    );

  const [progressMs, setProgressMs] = useState(0);

  useEffect(() => {
    if (
      currentlyPlayingTrack?.progress_ms &&
      currentlyPlayingTrack?.item?.duration_ms &&
      currentlyPlayingTrack?.is_playing
    ) {
      setProgressMs(currentlyPlayingTrack.progress_ms);
      const interval = setInterval(() => {
        setProgressMs((currentProgress) => {
          if (currentProgress >= currentlyPlayingTrack.item.duration_ms) {
            refetchCurrentlyPlayingTrack();
            return 0;
          }
          return currentProgress + 1e3;
        });
      }, 1e3);
      return () => clearInterval(interval);
    }
  }, [currentlyPlayingTrack]);

  const { cursorY, cursorX } = useMouseMotionValue();

  const [isHovering, setIsHovering] = useState(false);
  const isHoveringMotion = useMotionValue(isHovering);
  useEffect(() => {
    isHoveringMotion.set(isHovering);
  }, [isHovering]);

  const distanceWRTBottomRight = useTransform(
    [cursorX, cursorY],
    ([cursorX, cursorY]: number[]) => {
      if (typeof window === "undefined") return 0;
      if (isHoveringMotion.get()) return 0;
      const dx = window.innerWidth - cursorX;
      const dy = window.innerHeight - cursorY;
      return Math.sqrt(dx ** 2 + dy ** 2);
    },
  );

  const scaleTransform = useSpring(
    useTransform(distanceWRTBottomRight, (d: number): number => {
      if (d > PARTIAL_THRESHOLD) return 0.25;
      return 1;
    }),
    {
      stiffness: 1000,
      damping: 100,
    },
  );

  const xTransform = useSpring(
    useTransform(distanceWRTBottomRight, (d: number): string => {
      if (d > PARTIAL_THRESHOLD) return "50%";
      return "0%";
    }),
    {
      stiffness: 1000,
      damping: 100,
    },
  );

  const yTransform = useSpring(
    useTransform(distanceWRTBottomRight, (d: number): string => {
      if (d > PARTIAL_THRESHOLD) return "50%";
      return "0%";
    }),
    {
      stiffness: 1000,
      damping: 100,
    },
  );

  if (!currentlyPlayingTrack) {
    return null;
  }

  const {
    item: {
      name,
      album: {
        name: albumName,
        images: [albumArt],
      },
      artists,
      duration_ms,
    },
    is_playing,
  } = currentlyPlayingTrack;

  return (
    <motion.div
      layoutRoot
      layoutId="currently-playing"
      className={cn(
        "fixed z-10 w-96 rounded-full bottom-2 right-2 overflow-visible",
        {
          "bg-muted/25 backdrop-blur border-2 p-2 rounded-[3rem] overflow-clip":
            isHovering,
        },
      )}
      style={{
        originX: 1,
        originY: 1,
        scale: scaleTransform,
        x: xTransform,
        y: yTransform,
      }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.div
        layoutId="album-art"
        className="aspect-square shadow-xl rounded-full overflow-clip border-2"
        animate={{
          marginTop: isHovering ? "-50%" : 0,
        }}
      >
        <Singing
          minSize={50}
          maxSize={200}
          spreadDistance={1000}
          spreadDirection={180}
          hideNotes={isHovering || !is_playing}
        />
        <motion.div
          className="grid grid-cols-1 grid-rows-1 items-center justify-items-center"
          animate={{
            rotateZ: is_playing ? 360 : 0,
          }}
          transition={{
            duration: 10,
            repeat: Number.MAX_SAFE_INTEGER,
            ease: "linear",
          }}
        >
          <img
            className="w-full h-full col-start-1 row-start-1 brightness-75 dark:brightness-100"
            src={albumArt.url}
            width={albumArt.width}
            height={albumArt.height}
            alt={albumName}
          />
          <div
            className="relative col-start-1 row-start-1 items-center justify-center"
            aria-hidden
          >
            <div className="size-[150px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/20 backdrop-blur-sm" />
            <div className="size-[143px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-dotted border-gray-200/10" />
            <div className="size-[127px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white bg-[#9799a5]" />
            <div className="size-[85px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9c2c7]" />
            <div className="size-[70px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9c2c7]" />
            <div className="size-[67px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e3dee4]" />
            <div className="size-[60px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#a6a4a5] bg-muted shadow-[0_0_24px_-12px_rgba(0,0,0,0.25)_inset]" />
          </div>
        </motion.div>
      </motion.div>
      {isHovering && (
        <div className="px-10 pb-2 space-y-4">
          <AudioLinesIcon
            animate={is_playing}
            duration={1}
            svgProps={{ className: "size-14 opacity-50" }}
          />
          <p className="text-2xl flex-1 text-center">{name}</p>
          <div className="flex items-center gap-3">
            <AnimatedTime time={progressMs} />
            <div className="h-2 rounded bg-background border flex-1">
              <motion.div
                className="bg-muted-foreground/50 h-full max-w-full rounded w-0"
                animate={{ width: `${(progressMs / duration_ms) * 100}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <AnimatedTime time={duration_ms} />
          </div>
          <div className="flex flex-wrap justify-between gap-3 text-lg w-full">
            <p
              className={cn("inline-flex items-center gap-2", {
                hidden: albumName === name,
              })}
            >
              <Music2 /> <span className="line-clamp-1">{albumName}</span>
            </p>
            <Artists ids={artists.map(({ id }) => id)} singing={is_playing} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AnimatedTime({ time }: { time: number }) {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

  return (
    <div className="text-lg">
      {hours && (
        <NumberFlow
          format={{ minimumIntegerDigits: 1, useGrouping: false }}
          suffix=":"
          value={hours}
        />
      )}
      <NumberFlow
        format={{ minimumIntegerDigits: 1, useGrouping: false }}
        suffix=":"
        value={minutes ?? 0}
      />
      <NumberFlow
        format={{ minimumIntegerDigits: 2, useGrouping: false }}
        value={seconds ?? 0}
      />
    </div>
  );
}

const MotionLinkPreview = motion.create(LinkPreview);

function Artists({
  ids,
  singing = false,
}: {
  ids: string[];
  singing?: boolean;
}) {
  const { data: artists } = useQuery(
    {
      queryKey: ["artists", ...ids],
      queryFn: async () => {
        const { data } = await actions.spotify.getArtists(ids);
        return data;
      },
      refetchOnMount: false,
    },
    queryClient,
  );

  if (!artists) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 justify-around">
      {artists.map(
        ({ name, external_urls: { spotify }, images: [artistImage], uri }) => (
          <MotionLinkPreview
            key={uri}
            layoutId={uri}
            url={spotify}
            width={100}
            isStatic
            imageSrc={artistImage.url}
            className="inline-flex items-center gap-2 relative opacity-50 hover:opacity-100"
          >
            <Singing hideNotes={singing === false} spreadDirection={270} />
            <Mic2 />
            {name}
          </MotionLinkPreview>
        ),
      )}
    </div>
  );
}

const iconSet = [Music, Music2, Music3, Music4];

type SingingProps = {
  /** Hide the floating icons if true */
  hideNotes?: boolean;
  /** Minimum icon size in px */
  minSize?: number;
  /** Maximum icon size in px */
  maxSize?: number;
  /** Base distance from the origin point (0,0) */
  spreadDistance?: number;
  /** Base direction, in degrees, where icons are mostly spread */
  spreadDirection?: number;
  /** Animation speed multiplier */
  speed?: number;
};

export function Singing({
  hideNotes = false,
  minSize = 16,
  maxSize = 24,
  spreadDistance = 100,
  spreadDirection = 90,
  speed = 1,
}: SingingProps) {
  // If we don't want notes, just render nothing
  if (hideNotes) return null;

  // Pre-pick random icons from the icon set
  const randomIcons = useMemo(
    () =>
      Array.from({ length: 7 }, () => {
        const Icon = iconSet[Math.floor(Math.random() * iconSet.length)];
        return Icon;
      }),
    [],
  );

  /**
   * Convert spreadDirection (degrees) to radians.
   * This is our "central" angle for the random spread.
   */
  const centralAngle = useMemo(() => {
    return (spreadDirection * Math.PI) / 180;
  }, [spreadDirection]);

  /**
   * Return a random angle around `centralAngle`
   * with a +/- ~22.5° (π/4) spread for variety.
   */
  function getRandomAngle(): number {
    const spreadAngle = Math.PI / 4; // 45 degrees in radians
    const min = centralAngle - spreadAngle / 2;
    const max = centralAngle + spreadAngle / 2;
    return Math.random() * (max - min) + min;
  }

  /**
   * Return a random distance around `spreadDistance`
   * with +/- 20% variation.
   */
  function getRandomDistance(): number {
    const variation = 0.2; // 20%
    const min = spreadDistance * (1 - variation);
    const max = spreadDistance * (1 + variation);
    return Math.random() * (max - min) + min;
  }

  return (
    <div
      // The "invisible, zero-size" container
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: "none", // so it doesn't interfere with clicks
        overflow: "visible", // so absolutely positioned children are visible
      }}
    >
      {randomIcons.map((Icon, index) => {
        const angle = getRandomAngle();
        const distance = getRandomDistance();

        // Convert polar to cartesian offsets
        const randomX = distance * Math.cos(angle);
        const randomY = distance * Math.sin(angle);

        // Random rotation for each icon
        const randomRotate = Math.random() * -90;

        // Adjust speed by scaling the duration
        const baseDuration = 2; // base duration in seconds
        const adjustedDuration = baseDuration / speed + Math.random() * 1;

        return (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0.8,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              x: randomX,
              y: randomY,
              rotate: randomRotate,
            }}
            transition={{
              duration: adjustedDuration,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 1.5 + index * 0.2,
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {/* Render the icon with a random size */}
            <Icon
              size={Math.random() * (maxSize - minSize) + minSize}
              // Optional: className for color styling
              className="text-muted-foreground"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
