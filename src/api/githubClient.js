import { Octokit } from '@octokit/core';

const apiClient = new Octokit({
  auth: process.env.REACT_APP_GITHUB_TOKEN
})

export default apiClient;