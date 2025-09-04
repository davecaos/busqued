// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Heading, Stack } from '@chakra-ui/react';
import { LoginModal } from '@/components/modals/LoginModal';
import { EditPostModal } from '@/components/modals/EditPostModal';

export const Header = ({ postsState, setPostsState }) => {
  const setIsLoginOpen = (isLoginOpen) => setPostsState({ isLoginOpen });
  const setIsDraftPostOpen = (isDraftPostOpen) =>
    setPostsState({ isDraftPostOpen });
  const setPosts = (posts) => setPostsState({ posts });

  return (
    <>
      <Heading size="xl">Busqued (Drafts app for Bluesky social 🦋)</Heading>
      <LoginModal
        isLoginOpen={postsState.isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        agent={postsState.agent}
      />
      <EditPostModal
        isDraftPostOpen={postsState.isDraftPostOpen}
        setIsDraftPostOpen={setIsDraftPostOpen}
        posts={postsState.posts}
        setPosts={setPosts}
        postIndex={postsState.postIndex}
      />
    </>
  );
};
