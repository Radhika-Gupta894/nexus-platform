/**
 * NEXUS Intelligence Urgency Engine
 * Categorizes civic reports based on keyword priority and AI fallback.
 */

const URGENCY_LEVELS = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

const KEYWORDS = {
  [URGENCY_LEVELS.HIGH]: [
    "no water supply", "emergency", "fire", "flood", "accident", "injured",
    "gas leak", "electricity danger", "medical crisis", "severe hunger",
    "disaster", "women safety threat", "danger", "critical", "hospital",
    "bleeding", "collapsed", "explosion"
  ],
  [URGENCY_LEVELS.MEDIUM]: [
    "garbage overflow", "drainage issue", "pothole", "streetlight not working",
    "sewage leak", "moderate water leakage", "traffic signal issue",
    "repeated complaint", "broken pipe", "blocked road", "animal rescue"
  ],
  [URGENCY_LEVELS.LOW]: [
    "cleaning request", "maintenance", "suggestion", "minor repair",
    "information request", "park issue", "noise", "graffiti", "tree trimming"
  ]
};

/**
 * Detects urgency based on text keywords.
 * Returns High if any High keyword matches, else Medium, else Low.
 */
export const detectUrgencyLocally = (text = "") => {
  const input = text.toLowerCase();
  
  // Check High Priority first
  if (KEYWORDS[URGENCY_LEVELS.HIGH].some(kw => input.includes(kw))) {
    return URGENCY_LEVELS.HIGH;
  }
  
  // Check Medium Priority
  if (KEYWORDS[URGENCY_LEVELS.MEDIUM].some(kw => input.includes(kw))) {
    return URGENCY_LEVELS.MEDIUM;
  }
  
  // Default to Low only if no other keywords match
  // But check Low keywords to be sure
  if (KEYWORDS[URGENCY_LEVELS.LOW].some(kw => input.includes(kw))) {
    return URGENCY_LEVELS.LOW;
  }

  // Final fallback if absolutely nothing matches
  return URGENCY_LEVELS.LOW;
};

/**
 * Main entry point for urgency detection.
 * Integrates AI result with local keyword backup.
 */
export const calculateIntelligenceUrgency = (text, aiUrgency = null) => {
  // If AI provided a valid level, use it (after normalization)
  if (aiUrgency) {
    const normalized = aiUrgency.charAt(0).toUpperCase() + aiUrgency.slice(1).toLowerCase();
    if (Object.values(URGENCY_LEVELS).includes(normalized)) {
      return normalized;
    }
  }

  // Fallback to local keyword engine
  return detectUrgencyLocally(text);
};

export const getUrgencyColor = (urgency) => {
  switch (urgency?.toLowerCase()) {
    case "high": return "#ef4444"; // Red
    case "medium": return "#f97316"; // Orange
    case "low": return "#22c55e"; // Green
    default: return "#22c55e";
  }
};
