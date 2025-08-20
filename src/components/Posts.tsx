// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useCallback } from "react";
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
import { Context } from "./Context";
import { useContext } from "react";

import { PasswordInput } from "@/components/ui/password-input";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@chakra-ui/react";
import { getPostOnLocalStorage } from "@/logic/localstorage";
import { postingToBsky, savePost, editDraft, deleteDraft } from "@/logic/post";
import { login } from "@/logic/login";
import  Post  from "./Post";

const Posts = ({postsState,setPostsState}) => {
  const setPosts = (posts) => setPostsState({posts});
  const setPostIndex = (postIndex) => setPostsState({postIndex});
  const setIsDraftPostOpen = (isDraftPostOpen) => setPostsState({isDraftPostOpen});
  

  return (
    <>
    {Object.keys(postsState.posts).map((index) => {

  const handlePostToBluesky = () => {

    postingToBsky(postsState.agent, postsState.posts, index, setPosts)
  };
  const handleEditDraft = () => {editDraft(index, setPostIndex, setIsDraftPostOpen)};
  const handleDeleteDraft = () => {deleteDraft(index, postsState.posts, setPosts)};
      return !isNaN(index) ? (
        <Stack key={index}>
          <Post
            text={postsState.posts[index]?.text} 
            postToBluesky={handlePostToBluesky}
            editDraft={handleEditDraft}
            deleteDraft={handleDeleteDraft}
          />
        </Stack>
      ) : null;
    })}
    </>
  );
};

export default Posts;
