// ============================================================
// = STAR DISPLAY COMPONENT                                    =
// = Volle, halve en lege sterren op basis van rating          =
// ============================================================

import { HStack, Box } from "@chakra-ui/react";

// ============================================================
// = SVG ICONS                                                 =
// ============================================================

// Volle ster
function FullStar({ size }) {
  return (
    <Box
      as="svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="gold"
    >
      <path d="M12 .587l3.668 7.568L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.593z" />
    </Box>
  );
}

// Halve ster (linkerhelft gevuld)
function HalfStar({ size }) {
  return (
    <Box
      as="svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <defs>
        <linearGradient id="half-grad">
          <stop offset="50%" stopColor="gold" />
          <stop offset="50%" stopColor="lightgray" />
        </linearGradient>
      </defs>

      <path
        fill="url(#half-grad)"
        d="M12 .587l3.668 7.568L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.593z"
      />
    </Box>
  );
}

// Lege ster
function EmptyStar({ size }) {
  return (
    <Box
      as="svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="lightgray"
    >
      <path d="M12 .587l3.668 7.568L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.593z" />
    </Box>
  );
}

// ============================================================
// = COMPONENT                                                 =
// ============================================================
export default function StarDisplay({ rating, size = "28px" }) {
  // ============================================================
  // = RATING LOGICA                                            =
  // ============================================================
  const fullStars = Math.floor(rating);
  const decimal = rating % 1;
  const hasHalfStar = decimal >= 0.25 && decimal <= 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // ============================================================
  // = RENDER                                                    =
  // ============================================================
  return (
    <HStack spacing={1}>
      {/* ============================================== */}
      {/* = VOLLE STERREN                               = */}
      {/* ============================================== */}
      {[...Array(fullStars)].map((_, i) => (
        <FullStar key={`full-${i}`} size={size} />
      ))}

      {/* ============================================== */}
      {/* = HALVE STER                                   = */}
      {/* ============================================== */}
      {hasHalfStar && <HalfStar size={size} />}

      {/* ============================================== */}
      {/* = LEGE STERREN                                = */}
      {/* ============================================== */}
      {[...Array(emptyStars)].map((_, i) => (
        <EmptyStar key={`empty-${i}`} size={size} />
      ))}
    </HStack>
  );
}
