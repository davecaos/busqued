// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, Heading, Stack, HStack, VStack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { BskyAgent } from "@atproto/api";
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
} from "@/components/ui/dialog";
import { Context } from "@/Context";
import { useContext } from "react";

import { PasswordInput } from "@/components/ui/password-input";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@chakra-ui/react";
import { getPostOnLocalStorage } from "@/logic/localstorage";
import { postingToBsky, savePost, edit, deletePost } from "@/logic/post";


export const EditPostModal = () => {
  const {
    isLoginOpen,
    setIsLoginOpen,
    isDraftPostOpen,
    setIsDraftPostOpen,
    posts,
    setPosts,
    draftText,
    setDraftText,
    postIndex,
    agent,
  } = useContext(Context);

  let [charactersLeft, setCharactersLeft] = useState(300 - draftText.length);
  const index = postIndex != 0 ? postIndex : (posts?.last_index || 1) + 1;

  useEffect(() => {
    setCharactersLeft(300 - draftText.length);
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
              value={draftText}
              colorPalette={charactersLeft >= 0 ? "black" : "red"}
              autoresize
              onChange={(e) => {
                setDraftText(e.target.value);
                setCharactersLeft(300 - draftText.length);
              }}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
            />
          </DialogBody>
          <DialogFooter>
            <VStack>
              <HStack>
                <Tag
                  size="sm"
                  colorPalette={charactersLeft >= 0 ? "green" : "red"}
                >
                  {charactersLeft}
                </Tag>
                <Stack m={1} direction="row">
                  <Button
                    onClick={() =>
                      savePost(
                        posts,
                        index,
                        draftText,
                        setPosts,
                        setIsDraftPostOpen,
                      )
                    }
                    variant="outline"
                  >
                    Save
                  </Button>
                  {/*<Button onClick={() => postingToBsky(agent, posts, null, setPosts)} variant="outline"> Post </Button>*/}
                </Stack>
                <DialogActionTrigger asChild>
                  <Button
                    onClick={() => {
                      setIsDraftPostOpen(false);
                      setCharactersLeft(300);
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
