/**
 * Converts "HH:mm" string to total minutes from midnight.
 * Example: "01:30" -> 90
 */
export function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * Converts total minutes from midnight to "HH:mm" string.
 * Example: 90 -> "01:30"
 */
export function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Checks if two time ranges overlap.
 * Logic: (StartA < EndB) && (EndA > StartB)
 */
export function isOverlapping(
    startA: number,
    endA: number,
    startB: number,
    endB: number
): boolean {
    return startA < endB && endA > startB;
}
