import { OpenAIAPI } from 'openai';

const openai = new OpenAIAPI({
  key: process.env.REACT_APP_GITHUB_TOKEN, // Replace 'YOUR_API_KEY' with your actual API key
  organization: 'tt' // Optional: Replace 'YOUR_ORG_ID' with your organization ID
});

export default apiClient;