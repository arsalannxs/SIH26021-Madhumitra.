import { GoogleGenAI } from '@google/genai';
import { Hive, SensorReading } from '../types';

export interface ColonyAdviceResult {
  summary: string;
  recommendedInspectionQuestions: string[];
  riskAssessment: 'Low Risk' | 'Moderate Attention Required' | 'Elevated Action Required';
  caveatDisclaimer: string;
  isAiGenerated: boolean;
}

export async function generateColonyAdvice(
  hive: Hive,
  recentTelemetry?: SensorReading[]
): Promise<ColonyAdviceResult> {
  const apiKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY || '';

  const telemetrySummary = recentTelemetry && recentTelemetry.length > 0
    ? `Latest 24h readings: Temp ${hive.temperatureC}°C, Humidity ${hive.humidityPct}%, Weight ${hive.weightKg}kg, Acoustic activity ${hive.acousticHz}Hz.`
    : `Current readings: Temp ${hive.temperatureC}°C, Humidity ${hive.humidityPct}%, Weight ${hive.weightKg}kg.`;

  const promptText = `You are an expert apiculturist and beekeeping advisor for rural Indian beekeepers under the Ministry of MSME Madhumitra initiative.
Analyse the following hive observations and environmental telemetry:

Hive ID: ${hive.code} (${hive.hiveType})
Apiary: ${hive.apiaryName}
Colony Established: ${hive.colonyEstablishedDate}
Last Inspected: ${hive.lastInspectedDate}
Queen Status: ${hive.queenStatus}
Comb Health: ${hive.combHealth}
Beekeeper Notes: "${hive.notes}"
${telemetrySummary}

Provide:
1. A concise, practical 2-3 sentence summary in simple, supportive language.
2. 3 to 4 specific physical inspection questions the beekeeper should verify during the next hive check.
3. A risk assessment label: "Low Risk", "Moderate Attention Required", or "Elevated Action Required".

IMPORTANT COMPLIANCE INSTRUCTIONS:
- You must NOT claim absolute disease diagnosis or swarm certainty.
- Explicitly state that sensor anomalies are indicators for physical inspection, not definitive proof of disease.
- Keep recommendations simple and realistic for rural beekeepers.
Return your response formatted cleanly with sections.`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
      });

      const responseText = response.text || '';
      return {
        summary: responseText.slice(0, 350).trim(),
        recommendedInspectionQuestions: [
          'Are workers actively clustering and fanning the entrance during mid-day heat?',
          'Is the brood pattern solid with capped workers, or are drone cells predominant?',
          'Is nectar forage currently available within 2 km radius, or is supplemental sugar syrup necessary?',
          'Examine the bottom board for varroa mites or wax moth webbing.',
        ],
        riskAssessment: hive.temperatureC > 36.5 || hive.weightKg < 22 ? 'Moderate Attention Required' : 'Low Risk',
        caveatDisclaimer: 'AI-assisted preliminary suggestion based on telemetry and notes. Physical visual inspection by the beekeeper is required before taking intervention steps.',
        isAiGenerated: true,
      };
    } catch (err) {
      console.warn('Gemini API request failed, falling back to rule-based apicultural engine:', err);
    }
  }

  // Grounded rule-based apicultural engine (Deterministic & transparent)
  const isTempHigh = hive.temperatureC > 36.0;
  const isTempLow = hive.temperatureC < 32.0;
  const isWeightLow = hive.weightKg < 22.0;
  const isAcousticHigh = hive.acousticHz > 250;

  let summary = `Colony exhibits ${hive.combHealth.toLowerCase()} condition with ${hive.queenStatus.toLowerCase()} status. `;
  if (isTempHigh) {
    summary += `Brood nest temperature of ${hive.temperatureC}°C is above the optimal 34.5°C range, indicating high ambient heat load or insufficient entrance ventilation. `;
  } else if (isTempLow) {
    summary += `Internal temperature (${hive.temperatureC}°C) is cooler than ideal brood cluster temperature (34–35°C). Check for colony chill or reduced bee population. `;
  } else {
    summary += `Thermal regulation is within normal brood chamber stability limits (34.0–35.5°C). `;
  }

  if (isWeightLow) {
    summary += `Hive weight is on the lighter side (${hive.weightKg} kg); verify winter food stores or super capacity.`;
  }

  const questions: string[] = [];
  if (isTempHigh) {
    questions.push('Check if direct solar radiation is heating the outer lid; install thatch shade or bamboo matting.');
    questions.push('Inspect the entrance reducer: ensure bees have full entrance width for natural fanning airflow.');
  } else {
    questions.push('Inspect 3 central brood frames: verify unbroken concentric oval brood pattern and healthy pearly-white larvae.');
  }

  if (isAcousticHigh) {
    questions.push('Higher acoustic frequency detected (>250Hz): gently check for queen presence, piping sounds, or emergency queen cells indicating swarm preparation.');
  } else {
    questions.push('Check honey supers for comb capping (at least 75% capped before considering harvest).');
  }

  questions.push('Inspect bottom tray for debris, wax moth droppings, or signs of ants and predatory hornets.');

  return {
    summary,
    recommendedInspectionQuestions: questions,
    riskAssessment: isTempHigh || isAcousticHigh || isWeightLow ? 'Moderate Attention Required' : 'Low Risk',
    caveatDisclaimer: 'Rule-based apicultural advisory guideline. A sensor anomaly is not proof of disease; rely on tactile physical frame inspection.',
    isAiGenerated: false,
  };
}
