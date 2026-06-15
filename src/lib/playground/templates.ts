export type PromptTemplate = {
  id: string;
  labelKey: string;
  text: string;
};

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "summarize",
    labelKey: "pgTemplateSummarize",
    text: "Summarize the following text into clear bullet points highlighting the main ideas, decisions, and action items:\n\n{{text}}",
  },
  {
    id: "improve",
    labelKey: "pgTemplateImprove",
    text: "Improve this prompt for clarity, constraints, and output format. Return only the improved prompt:\n\n{{prompt}}",
  },
  {
    id: "code",
    labelKey: "pgTemplateCode",
    text: "Explain the following code in {{language}} for a {{audience}} audience. Cover purpose, key logic, and edge cases:\n\n```\n{{code}}\n```",
  },
  {
    id: "marketing",
    labelKey: "pgTemplateMarketing",
    text: "Write {{tone}} marketing copy for {{product}} targeting {{audience}}. Include a headline, value proposition, and CTA.",
  },
  {
    id: "requirements",
    labelKey: "pgTemplateRequirements",
    text: "Analyze these requirements and produce: goals, assumptions, risks, open questions, and a suggested implementation outline:\n\n{{requirements}}",
  },
  {
    id: "email",
    labelKey: "pgTemplateEmail",
    text: "Write a professional email to {{recipient}} about {{topic}}. Tone: {{tone}}. Include subject line and body.",
  },
];
