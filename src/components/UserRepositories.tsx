import {
  Box,
  Stack,
  Text,
  Link,
  Tag,
  Wrap,
  WrapItem,
  Spinner,
  Alert,
  SimpleGrid,
  Card,
  CardBody,
  useBreakpointValue,
  SlideFade,
} from '@chakra-ui/react';
import { AlertIcon } from '@chakra-ui/icons';
import { useGitHubRepos } from '../hooks/useGitHubRepos';

interface UserRepositoriesProps {
  username: string;
}

export const UserRepositories = ({ username }: UserRepositoriesProps) => {
  const { repositories, isLoading, error } = useGitHubRepos(username);
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isLoading) {
    return (
      <Box textAlign="center" py={isMobile ? 2 : 4}>
        <Spinner size={isMobile ? "sm" : "md"} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" mt={2} size={isMobile ? "sm" : "md"}>
        <AlertIcon />
        Failed to load repositories
      </Alert>
    );
  }

  if (!repositories?.length) {
    return (
      <Text 
        textAlign="center" 
        color="gray.600" 
        mt={2}
        fontSize={isMobile ? "sm" : "md"}
      >
        No repositories found
      </Text>
    );
  }

  return (
    <SlideFade in={true} offsetY="20px">
      <Stack spacing={isMobile ? 2 : 4} mt={2}>
        <SimpleGrid 
          columns={[1, 1, 2]} 
          spacing={isMobile ? 2 : 4}
        >
          {repositories.map((repo) => (
            <Card 
              key={repo.id} 
              size="sm" 
              variant="outline"
              transition="all 0.2s"
              _hover={{ shadow: 'sm' }}
            >
              <CardBody p={isMobile ? 2 : 3}>
                <Stack spacing={isMobile ? 1 : 2}>
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.600"
                    fontWeight="bold"
                    fontSize={isMobile ? "sm" : "md"}
                    isTruncated
                  >
                    {repo.name}
                  </Link>
                  
                  {repo.description && (
                    <Text 
                      color="gray.600" 
                      fontSize={isMobile ? "xs" : "sm"} 
                      noOfLines={2}
                    >
                      {repo.description}
                    </Text>
                  )}

                  <Wrap spacing={1}>
                    {repo.language && (
                      <WrapItem>
                        <Tag 
                          size="sm" 
                          colorScheme="blue"
                          fontSize={isMobile ? "xs" : "sm"}
                        >
                          {repo.language}
                        </Tag>
                      </WrapItem>
                    )}
                    <WrapItem>
                      <Tag 
                        size="sm" 
                        colorScheme="yellow"
                        fontSize={isMobile ? "xs" : "sm"}
                      >
                        ★ {repo.stargazers_count}
                      </Tag>
                    </WrapItem>
                    {repo.topics.slice(0, isMobile ? 1 : 2).map((topic) => (
                      <WrapItem key={topic}>
                        <Tag 
                          size="sm" 
                          colorScheme="green"
                          fontSize={isMobile ? "xs" : "sm"}
                        >
                          {topic}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </SlideFade>
  );
}; 