// SuggestOptimalEventTimes story
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal event times based on the user's schedule.
 *
 * - suggestOptimalEventTimes - A function that suggests optimal event times.
 * - SuggestOptimalEventTimesInput - The input type for the suggestOptimalEventTimes function.
 * - SuggestOptimalEventTimesOutput - The return type for the suggestOptimalEventTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalEventTimesInputSchema = z.object({
  schedule: z.string().describe('The user schedule in iCal format.'),
  duration: z.number().describe('The duration of the event in minutes.'),
  eventTitle: z.string().describe('The title of the event to schedule.'),
  dateRangeStart: z.string().describe('The start date of the range to search for optimal times in ISO format'),
  dateRangeEnd: z.string().describe('The end date of the range to search for optimal times in ISO format'),
});

export type SuggestOptimalEventTimesInput = z.infer<
  typeof SuggestOptimalEventTimesInputSchema
>;

const SuggestOptimalEventTimesOutputSchema = z.object({
  suggestedTimes: z.array(
    z.object({
      startTime: z.string().describe('The suggested start time in ISO format.'),
      endTime: z.string().describe('The suggested end time in ISO format.'),
      reason: z.string().describe('The reason for suggesting this time slot.'),
    })
  ).
describe('A list of suggested event times.'),
});

export type SuggestOptimalEventTimesOutput = z.infer<
  typeof SuggestOptimalEventTimesOutputSchema
>;

export async function suggestOptimalEventTimes(
  input: SuggestOptimalEventTimesInput
): Promise<SuggestOptimalEventTimesOutput> {
  return suggestOptimalEventTimesFlow(input);
}

const suggestOptimalEventTimesPrompt = ai.definePrompt({
  name: 'suggestOptimalEventTimesPrompt',
  input: {schema: SuggestOptimalEventTimesInputSchema},
  output: {schema: SuggestOptimalEventTimesOutputSchema},
  prompt: `You are a scheduling assistant that suggests optimal times for events
  based on a user's schedule.

  Given the following schedule in iCal format:
  {{schedule}}

  And the event details:
  - Event Title: {{eventTitle}}
  - Duration: {{duration}} minutes

  Find the best times between {{dateRangeStart}} and {{dateRangeEnd}} to schedule the event.
  Consider existing commitments and suggest times that minimize conflicts and maximize convenience for the user.
  Explain the reasoning behind each suggestion.
  Return the suggested times as a JSON array.
  `,
});

const suggestOptimalEventTimesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalEventTimesFlow',
    inputSchema: SuggestOptimalEventTimesInputSchema,
    outputSchema: SuggestOptimalEventTimesOutputSchema,
  },
  async input => {
    const {output} = await suggestOptimalEventTimesPrompt(input);
    return output!;
  }
);
