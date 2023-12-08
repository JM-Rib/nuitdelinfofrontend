import client from "./openAIClient";
// import { getToken } from '../utils/token';

const getPromptAnswer = async (message) => await client.complete( 
  {
    engine: 'text-davinci-003', // You can choose another engine if needed
    prompt: message,
    max_tokens: 500 // Adjust this based on the desired length of the response
  });

export default {
  getPromptAnswer
};