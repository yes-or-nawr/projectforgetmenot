// Fixed positions so server and browser render the same markup.
const MOTES = [
  [8, 72, 2, 9, 0], [14, 40, 3, 12, 2], [22, 85, 2, 10, 4], [31, 55, 4, 14, 1],
  [38, 30, 2, 11, 5], [46, 78, 3, 13, 3], [53, 48, 2, 9, 6], [61, 66, 3, 12, 2],
  [68, 22, 2, 10, 7], [74, 58, 4, 15, 1], [81, 82, 2, 11, 4], [88, 36, 3, 13, 6],
  [93, 70, 2, 9, 3], [27, 18, 2, 12, 8], [57, 90, 3, 14, 5], [71, 44, 2, 10, 0],
];

export function DustMotes({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {MOTES.map(([left, top, size, duration, delay], i) => (
        <span
          key={i}
          className="dust-mote"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
