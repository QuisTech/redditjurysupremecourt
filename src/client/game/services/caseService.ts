import { CaseData } from '../types';
import { IMMERSIVE_CASES } from '../data/immersiveCases';

export const generateAiCase = async (): Promise<CaseData | null> => {
  try {
    // Get seen IDs from session storage to prevent repeats
    const seenStorage = sessionStorage.getItem('seen_case_ids');
    const seenIds = seenStorage ? JSON.parse(seenStorage) : [];

    // Filter out cases user has already seen
    let availableCases = IMMERSIVE_CASES;
    if (Array.isArray(seenIds) && seenIds.length > 0) {
      availableCases = IMMERSIVE_CASES.filter((c) => !seenIds.includes(c.id));
    }

    // If we exhausted all cases (rare), reset pool
    if (availableCases.length === 0) availableCases = IMMERSIVE_CASES;

    const randomCase = availableCases[Math.floor(Math.random() * availableCases.length)];

    // Safety check
    if (!randomCase) {
      return IMMERSIVE_CASES[0] || null;
    }

    // Add new case ID to seen list
    if (randomCase.id) {
      const newSeen = [...seenIds, randomCase.id];
      sessionStorage.setItem('seen_case_ids', JSON.stringify(newSeen));
    }

    return randomCase;
  } catch (error) {
    console.error('Error generating case:', error);
    // Fallback to first case if something goes wrong
    return IMMERSIVE_CASES[0] || null;
  }
};
