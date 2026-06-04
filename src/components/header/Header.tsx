// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Heading, Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/modals/LoginModal';
import { EditPostModal } from '@/components/modals/EditPostModal';
import { Tag } from '@/components/ui/tag';
import { BlueskyLogo } from '@/components/ui/BlueskyLogo';
import { ColorModeButton } from '@/components/ui/color-mode';
import {
  clearSavedSession,
  createBskyAgent,
  fetchProfile,
} from '@/logic/login';

export const Header = ({ postsState, setPostsState }) => {
  const setIsLoginOpen = (isLoginOpen) => setPostsState({ isLoginOpen });
  const setIsDraftPostOpen = (isDraftPostOpen) =>
    setPostsState({ isDraftPostOpen });
  const setPosts = (posts) => setPostsState({ posts });
  const setLoginError = (loginError) => setPostsState({ loginError });

  const handleLogout = async () => {
    clearSavedSession();
    setPostsState({
      isLoggedIn: false,
      isLoginOpen: true,
      loginError: '',
      user: '',
      profile: null,
    });
    setPostsState({ agent: await createBskyAgent() });
  };

  return (
    <header className="app-header">
      <div className="app-header__bar">
        <div className="app-header__title">
          <div className="app-header__brand">
            <BlueskyLogo size={26} className="app-header__logo" />
            <Heading as="h1" size="lg" className="app-header__heading">
              Busqued
            </Heading>
          </div>
          <Text color="fg.muted" className="app-header__subtitle">
            Drafts app for Bluesky social
          </Text>
        </div>
        <div className="app-header__actions">
          <div className="app-header__actions-row">
            {postsState.isAuthLoading ? (
              <Tag colorPalette="blue">Checking session</Tag>
            ) : postsState.isLoggedIn ? (
              <Button size="sm" variant="outline" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPostsState({ isLoginOpen: true })}
              >
                Log in
              </Button>
            )}
            <ColorModeButton />
          </div>
          {postsState.isLoggedIn ? (
            <span className="app-header__user">
              {postsState.user || 'Logged in'}
            </span>
          ) : null}
        </div>
      </div>
      <LoginModal
        isLoginOpen={postsState.isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        agent={postsState.agent}
        loginError={postsState.loginError}
        setLoginError={setLoginError}
        onLoginSuccess={(user) => {
          setPostsState({
            isLoggedIn: true,
            isLoginOpen: false,
            loginError: '',
            user,
          });
          fetchProfile(postsState.agent, user).then((profile) => {
            setPostsState({ profile });
          });
        }}
      />
      <EditPostModal
        isDraftPostOpen={postsState.isDraftPostOpen}
        setIsDraftPostOpen={setIsDraftPostOpen}
        posts={postsState.posts}
        setPosts={setPosts}
        postIndex={postsState.postIndex}
        authorAvatar={postsState.profile?.avatar}
        authorDisplayName={postsState.profile?.displayName}
      />
    </header>
  );
};
