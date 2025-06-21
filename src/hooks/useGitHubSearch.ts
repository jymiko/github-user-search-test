import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchUsers, getUserRepositories } from '../services/github';
import type { GitHubUser, GitHubRepo } from '../types';
import { useDebounce } from '../hooks/useDebounce';

export const useGitHubSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Search users query
  const {
    data: users = [],
    isLoading: isSearching,
    error: searchError,
    isError: isSearchError,
  } = useQuery<GitHubUser[], Error>({
    queryKey: ['users', debouncedSearchTerm],
    queryFn: () => searchUsers(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once for search
  });

  // Repositories query for selected user
  const {
    data: repositories = [],
    isLoading: isLoadingRepos,
    error: reposError,
    isError: isReposError,
    refetch: refetchRepos,
  } = useQuery<GitHubRepo[], Error>({
    queryKey: ['repositories', selectedUser?.login],
    queryFn: () => selectedUser ? getUserRepositories(selectedUser.login) : Promise.resolve([]),
    enabled: !!selectedUser,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry twice for repositories
  });

  // Handle search input
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.length < 3) {
      setSelectedUser(null);
    }
  }, []);

  // Handle user selection
  const handleUserSelect = useCallback((user: GitHubUser) => {
    setSelectedUser(user);
  }, []);

  // Format error messages
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  return {
    searchTerm,
    users,
    selectedUser,
    repositories,
    isSearching,
    isLoadingRepos,
    searchError: isSearchError ? getErrorMessage(searchError) : null,
    reposError: isReposError ? getErrorMessage(reposError) : null,
    handleSearch,
    handleUserSelect,
    refetchRepos,
  };
}; 