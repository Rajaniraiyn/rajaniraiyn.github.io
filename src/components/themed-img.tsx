import { useTheme } from "@/contexts/theme"

interface ThemedImgProps extends Omit<React.ComponentProps<"img">, "src"> {
    src: {
        light: string
        dark: string
    }
}

export function ThemedImg({ src, ...props }: ThemedImgProps) {
    const { resolvedTheme } = useTheme()

    return <img src={src[resolvedTheme]} {...props} />
}