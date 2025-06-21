import { useQuery } from '@tanstack/react-query';
import type { GitHubRepo } from '../types';
import { getUserRepositories } from '../services/github';

export const useGitHubRepos = (username: string) => {
  const {
    data: repositories,
    isLoading,
    error,
  } = useQuery<GitHubRepo[], Error>({
    queryKey: ['repos', username],
    queryFn: () => getUserRepositories(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    repositories,
    isLoading,
    error,
  };
}; 