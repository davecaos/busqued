// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import './App.css';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, Heading, Stack, HStack, VStack } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { BskyAgent } from '@atproto/api';
import Posts from '@/components/Posts';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { PasswordInput } from '@/components/ui/password-input';
import { Tag } from '@/components/ui/tag';
import { Textarea } from '@chakra-ui/react';
import { getPostOnLocalStorage } from '@/logic/localstorage';
import { login } from '@/logic/login';
import { LoginModal } from '@/components/modals/LoginModal';
import { EditPostModal } from '@/components/modals/EditPostModal';
import { Header } from '@/components/header/Header';
import UseStateReducer from '@/hooks/UseStateReducer';

const LOREM_IPSUM = {
  last_index: 1,
  1: {
    text: 'el fascismo no se detiene, avanza, ocupa todo y luego explota solo. los que quedan después dicen "𝐲𝐨 𝐧𝐨 𝐬𝐚𝐛í𝐚 𝐧𝐚𝐝𝐚" y se civilizan un tiempo, hasta que el horror se diluye.\nCarlos Busqued',
  },
};

const App = () => {
  const savedPosts = getPostOnLocalStorage();
  const initialPosts = { ...LOREM_IPSUM, ...savedPosts };

  let [postsState, setPostsState] = UseStateReducer({
    isLoginOpen: false,
    isDraftPostOpen: false,
    posts: initialPosts,
    draftText: '',
    user: '',
    password: '',
    postIndex: 0,
    agent: new BskyAgent({ service: 'https://bsky.social' }),
  });

  useEffect(() => {
    async function getCredentials() {
      if ('credentials' in navigator) {
        const credentials = await navigator.credentials.get({ password: true });
        if (credentials) {
          setPostsState({ user: credentials.name });
          setPostsState({ password: credentials.password });
          await login(
            postsState.agent,
            credentials.name,
            credentials.password,
            (isLoginOpen) => {
              setPostsState({ isLoginOpen });
            }
          );
        } else {
          setPostsState({ isLoginOpen: true });
        }
      }
    }
    getCredentials();
  }, []);

  return (
    <>
      <Stack align="flex-start">
        <Header postsState={postsState} setPostsState={setPostsState} />
      </Stack>
      <Button
        colorPalette="blue"
        variant="subtle"
        borderColor="black"
        m={2}
        onClick={() => {
          setPostsState({ postIndex: 0 });
          setPostsState({ draftText: '' });
          setPostsState({ isDraftPostOpen: true });
        }}
        size="sm"
      >
        New Draft Post!
      </Button>
      <Stack>
        <Posts postsState={postsState} setPostsState={setPostsState} />
      </Stack>
    </>
  );
};

export default App;
