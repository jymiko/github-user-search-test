import { useState, useCallback } from 'react';
import {
  Box,
  Input,
  VStack,
  Text,
  List,
  ListItem,
  Avatar,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Link,
  Collapse,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
import { useGitHubSearch } from '../hooks/useGitHubSearch';
import type { GitHubUser } from '../types';

export const UserSearch: React.FC = () => {
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const toast = useToast();
  const {
    searchTerm,
    users,
    selectedUser,
    repositories,
    isSearching,
    isLoadingRepos,
    searchError,
    reposError,
    handleSearch,
    handleUserSelect,
    refetchRepos,
  } = useGitHubSearch();

  const toggleUserExpansion = useCallback((userId: number, user: GitHubUser) => {
    try {
      setExpandedUsers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(userId)) {
          newSet.delete(userId);
        } else {
          newSet.add(userId);
          handleUserSelect(user);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error toggling user expansion:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle repositories. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [handleUserSelect, toast]);

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      if (value.length > 100) {
        toast({
          title: 'Warning',
          description: 'Search term is too long. Please use a shorter search term.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      handleSearch(value);
    } catch (error) {
      console.error('Error handling search input:', error);
      toast({
        title: 'Error',
        description: 'Failed to process search input. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [handleSearch, toast]);

  const handleClearSearch = useCallback(() => {
    try {
      handleSearch('');
    } catch (error) {
      console.error('Error clearing search:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear search. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [handleSearch, toast]);

  const renderError = useCallback((error: string | null, onRetry?: () => void) => {
    if (!error) return null;
    return (
      <Alert status="error" mt={2} rounded="md">
        <AlertIcon />
        <Text flex="1">{error}</Text>
        {onRetry && (
          <Button size="sm" onClick={onRetry} ml={2}>
            Retry
          </Button>
        )}
      </Alert>
    );
  }, []);

  const renderRepositories = useCallback(() => {
    if (!selectedUser) return null;
    if (isLoadingRepos) {
      return (
        <Box textAlign="center" py={4}>
          <Spinner />
          <Text mt={2}>Loading repositories...</Text>
        </Box>
      );
    }
    if (reposError) {
      return renderError(reposError, refetchRepos);
    }
    if (!repositories || repositories.length === 0) {
      return (
        <Text color="gray.500" py={4} textAlign="center">
          No repositories found
        </Text>
      );
    }
    return (
      <List spacing={2} maxH="60vh" overflowY="auto" pr={2}>
        {repositories.map((repo) => (
          <ListItem
            key={repo.id}
            p={4}
            bg="gray.50"
            _dark={{ bg: 'gray.700' }}
            rounded="md"
            shadow="sm"
          >
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Link
                  href={repo.html_url}
                  isExternal
                  color="blue.500"
                  fontWeight="bold"
                  onClick={(e) => {
                    // Prevent the click from bubbling up to the ListItem
                    e.stopPropagation();
                  }}
                >
                  {repo.name}
                </Link>
                <HStack spacing={2}>
                  <Badge colorScheme="yellow">★ {repo.stargazers_count}</Badge>
                  <Badge colorScheme="purple">
                    {repo.language || 'No language'}
                  </Badge>
                </HStack>
              </HStack>
              {repo.description && (
                <Text color="gray.600" _dark={{ color: 'gray.300' }} fontSize="sm">
                  {repo.description}
                </Text>
              )}
            </VStack>
          </ListItem>
        ))}
      </List>
    );
  }, [selectedUser, isLoadingRepos, reposError, repositories, refetchRepos, renderError]);

  // Show a message when no results are found
  const renderNoResults = useCallback(() => {
    if (searchTerm.length >= 3 && !isSearching && users.length === 0) {
      return (
        <Text color="gray.500" textAlign="center" py={4}>
          No users found matching your search
        </Text>
      );
    }
    return null;
  }, [searchTerm, isSearching, users.length]);

  return (
    <Box 
      minH="100vh" 
      w="100%" 
      bg="gray.50" 
      _dark={{ bg: 'gray.900' }}
      py={4}
    >
      <Box 
        maxW="800px" 
        mx="auto" 
        px={4} 
        h="100%"
        display="flex"
        flexDirection="column"
      >
        <VStack spacing={4} align="stretch" flex="1">
          <InputGroup size="lg">
            <Input
              placeholder="Search GitHub users (min 3 characters)..."
              value={searchTerm}
              onChange={handleSearchInput}
              isInvalid={!!searchError}
              bg="white"
              _dark={{ bg: 'gray.800' }}
              maxLength={100}
              aria-label="Search GitHub users"
              pr="4.5rem"
            />
            {searchTerm && (
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  onClick={handleClearSearch}
                  icon={<CloseIcon />}
                  aria-label="Clear search"
                  variant="ghost"
                  _hover={{ bg: 'gray.100' }}
                  _dark={{ _hover: { bg: 'gray.700' } }}
                />
              </InputRightElement>
            )}
          </InputGroup>

          {searchError && renderError(searchError)}
          {renderNoResults()}

          {isSearching ? (
            <Box textAlign="center" py={4} aria-live="polite">
              <Spinner />
              <Text mt={2}>Searching users...</Text>
            </Box>
          ) : (
            users.length > 0 && (
              <List 
                spacing={2} 
                maxH="calc(100vh - 120px)"
                overflowY="auto"
                pr={2}
                role="list"
                aria-label="Search results"
              >
                {users.map((user) => (
                  <Box key={user.id}>
                    <ListItem
                      p={4}
                      bg={selectedUser?.id === user.id ? 'blue.50' : 'white'}
                      _dark={{
                        bg: selectedUser?.id === user.id ? 'blue.900' : 'gray.800',
                      }}
                      rounded="md"
                      shadow="sm"
                      cursor="pointer"
                      onClick={() => toggleUserExpansion(user.id, user)}
                      _hover={{ bg: 'blue.50', _dark: { bg: 'blue.900' } }}
                      role="button"
                      aria-expanded={expandedUsers.has(user.id)}
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          toggleUserExpansion(user.id, user);
                        }
                      }}
                    >
                      <HStack spacing={4}>
                        <Avatar 
                          size="md" 
                          src={user.avatar_url} 
                          name={user.login}
                        />
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="bold">{user.login}</Text>
                          {user.name && (
                            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
                              {user.name}
                            </Text>
                          )}
                        </VStack>
                        <HStack>
                          <Badge colorScheme="green">
                            {user.public_repos} repos
                          </Badge>
                          <Box
                            as={expandedUsers.has(user.id) ? ChevronUpIcon : ChevronDownIcon}
                            boxSize={5}
                            color="gray.500"
                            aria-hidden="true"
                          />
                        </HStack>
                      </HStack>
                    </ListItem>
                    <Collapse in={expandedUsers.has(user.id)}>
                      <Box 
                        mt={2} 
                        ml={4} 
                        borderLeft="2px" 
                        borderColor="blue.200"
                        pl={4}
                      >
                        {selectedUser?.id === user.id && renderRepositories()}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </List>
            )
          )}
        </VStack>
      </Box>
    </Box>
  );
}; 