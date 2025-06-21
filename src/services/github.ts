import axios, { AxiosError } from 'axios';
import type { GitHubUser, GitHubRepo, SearchUsersResponse } from '../types';

const GITHUB_API_BASE_URL = 'https://api.github.com';

// Create axios instance with auth if token is available
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    // Add GitHub token if available in environment
    ...(import.meta.env.VITE_GITHUB_TOKEN && {
      'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
    })
  },
});

export const searchUsers = async (query: string): Promise<GitHubUser[]> => {
  if (!query || query.length < 3) {
    return [];
  }

  try {
    console.log('Searching for users with query:', query);
    const response = await githubApi.get<SearchUsersResponse>('/search/users', {
      params: {
        q: query,
        per_page: 5,
      },
    });
    
    // Fetch additional user details for each user
    const detailedUsers = await Promise.all(
      response.data.items.map(async (user) => {
        try {
          const userDetailsResponse = await githubApi.get<GitHubUser>(`/users/${user.login}`);
          return userDetailsResponse.data;
        } catch (error) {
          console.error(`Failed to fetch details for user ${user.login}:`, error);
          // Return basic user info if detailed fetch fails
          return user;
        }
      })
    );

    return detailedUsers;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    } else if (axiosError.response?.status === 404) {
      throw new Error('No users found matching your search.');
    } else {
      console.error('Error searching users:', error);
      throw new Error('Failed to search GitHub users. Please check your connection and try again.');
    }
  }
};

export const getUserRepositories = async (username: string): Promise<GitHubRepo[]> => {
  if (!username) {
    throw new Error('Username is required');
  }

  try {
    console.log('Fetching repositories for user:', username);
    
    // First, get user details to check repository count
    const userResponse = await githubApi.get<GitHubUser>(`/users/${username}`);
    const totalRepos = userResponse.data.public_repos;
    
    // If user has repositories, fetch them with proper pagination
    if (totalRepos > 0) {
      const perPage = 100;
      const pages = Math.ceil(totalRepos / perPage);
      const requests = Array.from({ length: pages }, (_, i) =>
        githubApi.get<GitHubRepo[]>(`/users/${username}/repos`, {
          params: {
            sort: 'updated',
            direction: 'desc',
            per_page: perPage,
            page: i + 1,
          },
        })
      );

      const responses = await Promise.all(requests);
      const allRepos = responses.flatMap(response => response.data);

      console.log(`Successfully fetched ${allRepos.length} repositories for ${username}`);
      return allRepos;
    }
    
    return [];
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error details:', {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
    });

    if (axiosError.response?.status === 403) {
      const resetTime = axiosError.response.headers['x-ratelimit-reset'];
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      const resetMessage = resetDate 
        ? ` Try again after ${resetDate.toLocaleTimeString()}.`
        : ' Please try again later.';
      throw new Error('GitHub API rate limit exceeded.' + resetMessage);
    } else if (axiosError.response?.status === 404) {
      throw new Error(`User "${username}" not found.`);
    } else if (axiosError.response?.status === 401) {
      throw new Error('Authentication failed. Please check your GitHub token.');
    } else {
      throw new Error('Failed to fetch repositories. Please check your connection and try again.');
    }
  }
}; 