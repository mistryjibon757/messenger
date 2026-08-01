export default function BrandMark({ size = 44 }) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 6px 16px rgba(244,63,94,0.28))' }}
    >
      <circle cx="23" cy="28" r="15" fill="#f43f5e" opacity="0.88" />
      <circle cx="33" cy="28" r="15" fill="#fb923c" opacity="0.88" />
    </svg>
  )
}
