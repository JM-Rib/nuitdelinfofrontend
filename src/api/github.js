import client from "./githubClient";
// import { getToken } from '../utils/token';

const getCommits = async () => await client.request("GET /repos/{owner}/{repo}/commits", 
{ owner: 'JM-Rib',
  repo: 'nuitdelinfofrontend',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  } 
});

const getCommitContents = async (ref) => await client.request("GET /repos/{owner}/{repo}/commits/{ref}",
  {
    owner: 'JM-Rib',
    repo: 'nuitdelinfofrontend',
    ref: ref,
    headers: { 'X-GitHub-Api-Version': '2022-11-28'} 
  });

export default {
  getCommits,
  getCommitContents
};