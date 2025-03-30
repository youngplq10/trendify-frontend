export const beautifyTime = (time: string) : string => {
    return time.replaceAll("T", " ").slice(0, 16);
}