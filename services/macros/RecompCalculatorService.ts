import {
  RecompCalculatorResult,
  RecompDayProfile,
  RecompInput,
} from "@/types/macros";

// MyFitnessPal nutrient-partitioning constants (per lb of bodyweight)
const PROTEIN_PER_LB = 1.5;
const TRAINING_CARBS_PER_LB = 1.5;
const REST_CARBS_PER_LB = 0.35;
const MIN_FAT_PER_LB = 0.25; // hormonal health floor

function buildProfile(
  totalCalories: number,
  proteinGrams: number,
  carbsGrams: number,
  minFatGrams: number,
): RecompDayProfile {
  const proteinCals = proteinGrams * 4;
  const carbsCals = carbsGrams * 4;
  const fatGrams = Math.round(
    Math.max((totalCalories - proteinCals - carbsCals) / 9, minFatGrams),
  );

  const actualTotal = proteinCals + carbsCals + fatGrams * 9;
  return {
    calories: totalCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    proteinPercent:
      actualTotal > 0 ? Math.round((proteinCals * 100) / actualTotal) : 0,
    carbsPercent:
      actualTotal > 0 ? Math.round((carbsCals * 100) / actualTotal) : 0,
    fatPercent:
      actualTotal > 0 ? Math.round((fatGrams * 9 * 100) / actualTotal) : 0,
  };
}

/**
 * Body Recomposition Calculator — MyFitnessPal nutrient-partitioning formula.
 *
 * Step A: Protein = 1.5 g/lb (both days)
 * Step B: Training carbs = 1.5 g/lb · Rest carbs = 0.35 g/lb
 * Step C: Calories come directly from the user's targets (training & rest)
 * Step D: Fat = (total − protein_cal − carb_cal) / 9, floored at 0.25 g/lb
 */
export function calculateRecomp(input: RecompInput): RecompCalculatorResult {
  const { weightLbs, trainingCalories, restCalories } = input;

  const proteinGrams = Math.round(weightLbs * PROTEIN_PER_LB);
  const trainingCarbsGrams = Math.round(weightLbs * TRAINING_CARBS_PER_LB);
  const restCarbsGrams = Math.round(weightLbs * REST_CARBS_PER_LB);

  const minFatGrams = weightLbs * MIN_FAT_PER_LB;

  return {
    training: buildProfile(
      trainingCalories,
      proteinGrams,
      trainingCarbsGrams,
      minFatGrams,
    ),
    rest: buildProfile(restCalories, proteinGrams, restCarbsGrams, minFatGrams),
  };
}
