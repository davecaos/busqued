// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Heading, Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/modals/LoginModal';
import { EditPostModal } from '@/components/modals/EditPostModal';
import { Tag } from '@/components/ui/tag';
import { clearSavedSession, createBskyAgent } from '@/logic/login';

export const Header = ({ postsState, setPostsState }) => {
  const setIsLoginOpen = (isLoginOpen) => setPostsState({ isLoginOpen });
  const setIsDraftPostOpen = (isDraftPostOpen) =>
    setPostsState({ isDraftPostOpen });
  const setPosts = (posts) => setPostsState({ posts });
  const setLoginError = (loginError) => setPostsState({ loginError });

  const handleLogout = () => {
    clearSavedSession();
    setPostsState({
      agent: createBskyAgent(),
      isLoggedIn: false,
      isLoginOpen: true,
      loginError: '',
      user: '',
    });
  };

  return (
    <header className="app-header">
      <div className="app-header__bar">
        <div className="app-header__title">
          <Heading as="h1" size="xl">
            Busqued
          </Heading>
          <Text color="fg.muted">Drafts app for Bluesky social</Text>
        </div>
        <div className="app-header__actions">
          {postsState.isAuthLoading ? (
            <Tag colorPalette="blue">Checking session</Tag>
          ) : postsState.isLoggedIn ? (
            <>
              <Tag colorPalette="green">{postsState.user || 'Logged in'}</Tag>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPostsState({ isLoginOpen: true })}
            >
              Log in
            </Button>
          )}
        </div>
      </div>
      <LoginModal
        isLoginOpen={postsState.isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        agent={postsState.agent}
        loginError={postsState.loginError}
        setLoginError={setLoginError}
        onLoginSuccess={(user) =>
          setPostsState({
            isLoggedIn: true,
            isLoginOpen: false,
            loginError: '',
            user,
          })
        }
      />
      <EditPostModal
        isDraftPostOpen={postsState.isDraftPostOpen}
        setIsDraftPostOpen={setIsDraftPostOpen}
        posts={postsState.posts}
        setPosts={setPosts}
        postIndex={postsState.postIndex}
      />
    </header>
  );
};
