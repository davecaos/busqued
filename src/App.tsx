// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import "./App.css";
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
import { Context } from "./Context";
import { useContext } from "react";

import { PasswordInput } from "@/components/ui/password-input";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@chakra-ui/react";
import { getPostOnLocalStorage } from "@/logic/localstorage";
import { postingToBsky, savePost, edit, deletePost } from "@/logic/post";
import { login } from "@/logic/login";
import { LoginModal } from "@/components/modals/LoginModal";
import { EditPostModal} from "@/components/modals/EditPostModal";

const Title = () => {
  return (
    <Stack align="flex-start">
      <Heading size="xl">Busqued (Drafts for Himmelblau🦋)</Heading>
      <LoginModal/>
      <EditPostModal/>
    </Stack>
  );
};

const LOREM_IPSUM = {
  last_index: 1,
  1: {
    text: 'el fascismo no se detiene, avanza, ocupa todo y luego explota solo. los que quedan después dicen "𝐲𝐨 𝐧𝐨 𝐬𝐚𝐛í𝐚 𝐧𝐚𝐝𝐚" y se civilizan un tiempo, hasta que el horror se diluye.\nCarlos Busqued',
  },
};

const App = () => {
  let [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  let [isDraftPostOpen, setIsDraftPostOpen] = useState<boolean>(false);
  const savedPosts = getPostOnLocalStorage();
  let [posts, setPosts] = useState({ ...LOREM_IPSUM, ...savedPosts });
  let [postIndex, setPostIndex] = useState(0);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  let [agent, _setAgent] = useState(
    new BskyAgent({
      service: "https://bsky.social",
    }),
  );
  let [draftText, setDraftText] = useState("");

  useEffect(() => {
    async function getCredentials() {
      if ("credentials" in navigator) {
        const credentials = await navigator.credentials.get({ password: true });
        if (credentials) {
          setPassword(credentials.password);
          setUser(credentials.name);
          login(agent, credentials.name, credentials.password, setIsLoginOpen);
        } else {
          setIsLoginOpen(true);
        }
      }
    }
    getCredentials();
  }, []);

  return (
    <>
      <Context.Provider
        value={{
          isLoginOpen,
          setIsLoginOpen,
          isDraftPostOpen,
          setIsDraftPostOpen,
          posts,
          setPosts,
          draftText,
          setDraftText,
          postIndex,
          setPostIndex,
          agent,
        }}
      >
        <Title />
        <Button
          colorPalette="blue"
          variant="subtle"
          borderColor="black"
          m={2}
          onClick={() => {
            setPostIndex(0);
            setDraftText("");
            setIsDraftPostOpen(true);
          }}
          size="sm"
        >
          Neu Draft Post!
        </Button>
        <Stack>
          <SavedPosts/>
        </Stack>
      </Context.Provider>
    </>
  );
};

const SavedPosts = () => {
  const {
    setIsDraftPostOpen,
    posts,
    setPosts,
    setDraftText,
    setPostIndex,
    agent,
  } = useContext(Context);

  let renderedPosts = [];
  for (const index in posts) {
    !isNaN(index) &&
      renderedPosts.push(
        <>
          <Card.Root size="sm">
            <Card.Header>
              <Heading size="md"> Saved Post</Heading>
            </Card.Header>
            <Card.Body color="fg.muted">{posts[index]?.text}</Card.Body>
            <Stack direction="row">
              <HStack>
                <Button
                  m={1}
                  variant="outline"
                  onClick={() => postingToBsky(agent, posts, index, setPosts)}
                >
                  Post
                </Button>
                <Button
                  onClick={() => {
                    edit(
                      index,
                      posts,
                      setPostIndex,
                      setDraftText,
                      setIsDraftPostOpen,
                    );
                  }}
                  padding="20px"
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    deletePost(index, posts, setPosts);
                  }}
                  padding="20px"
                  variant="outline"
                >
                  Delete
                </Button>
              </HStack>
            </Stack>
          </Card.Root>
        </>,
      );
  }

  return renderedPosts;
};

export default App;
