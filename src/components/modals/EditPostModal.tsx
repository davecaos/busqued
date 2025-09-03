// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, Heading, Stack, HStack, VStack } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { BskyAgent } from '@atproto/api';
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
import { Context } from '@/Context';
import { useContext } from 'react';

import { PasswordInput } from '@/components/ui/password-input';
import { Tag } from '@/components/ui/tag';
import { Textarea } from '@chakra-ui/react';
import { getPostOnLocalStorage } from '@/logic/localstorage';
import { savePost } from '@/logic/post';

const MAX_POST_TEXT_LENGTH = 300;

export const EditPostModal = ({
  isDraftPostOpen,
  setIsDraftPostOpen,
  posts,
  setPosts,
  postIndex,
}) => {
  const index = postIndex != 0 ? postIndex : (posts?.last_index || 1) + 1;
  const [postText, setPostText] = useState(posts[index]?.text ?? '');
  let [charactersLeft, setCharactersLeft] = useState(
    MAX_POST_TEXT_LENGTH - posts[index]?.text.length
  );

  useEffect(() => {
    setCharactersLeft(MAX_POST_TEXT_LENGTH - postText.length);
  }, [setCharactersLeft]);

  return (
    <>
      <DialogRoot open={isDraftPostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Draf Post</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Textarea
              textStyle="md"
              value={postText}
              colorPalette={charactersLeft >= 0 ? 'black' : 'red'}
              autoresize
              onChange={(e) => {
                setPostText(e.target.value);
                setCharactersLeft(MAX_POST_TEXT_LENGTH - postText.length);
              }}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
            />
          </DialogBody>
          <DialogFooter>
            <VStack>
              <HStack>
                <Tag
                  size="sm"
                  colorPalette={charactersLeft >= 0 ? 'green' : 'red'}
                >
                  {charactersLeft}
                </Tag>
                <Stack m={1} direction="row">
                  <Button
                    onClick={() => {
                      savePost(
                        posts,
                        index,
                        postText,
                        setPosts,
                        setIsDraftPostOpen
                      );
                      setIsDraftPostOpen(false);
                    }}
                    variant="outline"
                  >
                    Save
                  </Button>
                </Stack>
                <DialogActionTrigger asChild>
                  <Button
                    onClick={() => {
                      setCharactersLeft(MAX_POST_TEXT_LENGTH);
                      setIsDraftPostOpen(false);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogActionTrigger>
              </HStack>
            </VStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
