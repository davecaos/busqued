import './App.css';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Posts from '@/components/Posts';
import { getPostOnLocalStorage } from '@/logic/localstorage';
import {
  createBskyAgent,
  fetchProfile,
  restoreSavedSession,
  type BskyProfile,
} from '@/logic/login';
import { Header } from '@/components/header/Header';
import UseStateReducer from '@/hooks/UseStateReducer';

const LOREM_IPSUM = {
  last_index: 1,
  1: {
    text: 'mis palabras sólo pueden ser entendidas desde lo espiritual y me disculpo si ofendí a alguien.',
  },
};

const App = () => {
  const agent = useMemo(() => createBskyAgent(), []);
  const initialPosts = useMemo(() => {
    const savedPosts = getPostOnLocalStorage();
    return { ...LOREM_IPSUM, ...savedPosts };
  }, []);

  const [postsState, setPostsState] = UseStateReducer({
    isLoginOpen: false,
    isDraftPostOpen: false,
    isAuthLoading: true,
    isLoggedIn: false,
    loginError: '',
    posts: initialPosts,
    user: '',
    postIndex: 0,
    profile: null as BskyProfile | null,
    agent,
  });

  useEffect(() => {
    let isMounted = true;

    async function restoreLogin() {
      const result = await restoreSavedSession(agent);

      if (!isMounted) {
        return;
      }

      setPostsState({
        isAuthLoading: false,
        isLoggedIn: result.restored,
        isLoginOpen: !result.restored,
        loginError: result.error || '',
        user: result.user,
      });

      if (result.restored && result.user) {
        fetchProfile(agent, result.user).then((profile) => {
          if (isMounted) {
            setPostsState({ profile });
          }
        });
      }
    }

    restoreLogin();

    return () => {
      isMounted = false;
    };
  }, [agent, setPostsState]);

  return (
    <div className="app-shell">
      <Header postsState={postsState} setPostsState={setPostsState} />
      <main className="app-main">
        <div className="draft-toolbar">
          <Button
            className="draft-toolbar__button"
            colorPalette="blue"
            onClick={() => {
              setPostsState({
                postIndex: 0,
                isDraftPostOpen: true,
              });
            }}
            size="sm"
          >
            New Draft!
          </Button>
        </div>
        <Posts postsState={postsState} setPostsState={setPostsState} />
      </main>
    </div>
  );
};

export default App;
