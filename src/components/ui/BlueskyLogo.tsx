interface BlueskyLogoProps {
  size?: number;
  className?: string;
}

// Official Bluesky butterfly mark (single path, currentColor-friendly).
export function BlueskyLogo({ size = 26, className }: BlueskyLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 568 501"
      width={size}
      height={size}
      role="img"
      aria-label="Bluesky"
      className={className}
      style={{ color: 'var(--bsky-blue)' }}
    >
      <path
        fill="currentColor"
        d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.193 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748 114.875 19.545 144.097 84.305 80.986 149.071-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.766-33.89-129.526 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.66 0 75.293 0 57.947 0-28.906 76.135-1.611 123.121 33.664Z"
      />
    </svg>
  );
}
