// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import './App.css'
import { useState,useEffect} from "react";
import { Button } from "@/components/ui/button"
import { Card, Heading, Stack, HStack, VStack } from "@chakra-ui/react"
import { Input } from "@chakra-ui/react"
import { BskyAgent } from '@atproto/api'
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
} from "@/components/ui/dialog"
import { Context } from "./Context";
import { useContext } from 'react';

import { PasswordInput } from "@/components/ui/password-input"
import { Tag } from "@/components/ui/tag"
import { Textarea } from "@chakra-ui/react"
import { getPostOnLocalStorage } from "@/logic/localstorage"
import { postingToBsky, savePost, edit, deletePost } from "@/logic/post"
import { login } from "@/logic/login"

var PasswordCredential: any
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface PasswordCredentialData {
    id: string;
    name?: string;
    iconURL?: string;
    password: string;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface PasswordCredentialConstructor extends Credential {
    new (passwordCredentialData: PasswordCredentialData): PasswordCredential;
    new (htmlFormElement: HTMLFormElement): PasswordCredential;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface PasswordCredential extends Credential {
    readonly iconURL: string;
    readonly password: string;
    readonly name: string;
  }

  const PasswordCredential: PasswordCredentialConstructor;

  // eslint-disable-next-line @typescript-eslint/naming-convention,no-unused-vars
  interface Window {
    PasswordCredential: PasswordCredentialConstructor;
  }

  interface CredentialContainer {
    get(options?: {
        password?: boolean,
        unmediated?: boolean,
        federated?: {
            providers?: string[],
            protocols?: string[]
        }
    }): Promise<Credential>;
    store(credential: Credential): Promise<Credential>;
    requireUserMediation(): Promise<void>;
  }
  
  interface Navigator {
    credentials?: CredentialContainer;    
  }

  interface Credential {
      readonly iconURL: string;
      readonly id: string;
      readonly name: string;
      readonly type: 'password' | 'federated';
  }
}

const Title = () => {
  return (
    <Stack align="flex-start">
      <Heading size="xl">Busqued (Drafts for Himmelblau🦋)</Heading>
      <DrafPostButton/>
    </Stack>
  )
}
 
const LOREM_IPSUM = {
  'last_index': 1,
  1: {text: "el fascismo no se detiene, avanza, ocupa todo y luego explota solo. los que quedan despu\u00E9s dicen \"yo no sab\u00EDa nada\" y se civilizan un tiempo, hasta que el horror se diluye.\nCarlos Busqued"}
};


const App = () => {
  let [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  let [isDraftPostOpen, setIsDraftPostOpen] = useState<boolean>(false);
  const savedPosts = getPostOnLocalStorage();
  let [posts, setPosts] = useState({...LOREM_IPSUM, ...savedPosts});
  let [postIndex, setPostIndex] = useState(0);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("")
  let [agent, _setAgent] = useState(new BskyAgent({
    service: 'https://bsky.social'
  }));
  let [draftText, setDraftText] = useState("");

  useEffect(() => {
    async function getCredentials() {
      if ("credentials" in navigator) {
        const credentials = await navigator.credentials.get({ password: true })
        if(credentials) {
          setPassword(credentials.password);
          setUser(credentials.name);
          login(agent, credentials.name, credentials.password, setIsLoginOpen)
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
      value = {
        { isLoginOpen, setIsLoginOpen, 
          isDraftPostOpen, setIsDraftPostOpen,
          posts, setPosts,
          draftText, setDraftText,
          postIndex, setPostIndex,
          agent
        }
      }>
    <Title/>
    <Button 
        colorPalette="blue" 
        variant="subtle" 
        m={2} 
        onClick={
          () => {
            setPostIndex(0); 
            setDraftText("");
             setIsDraftPostOpen(true)
          }
        } 
        size="sm"
      >Neu Draft Post!</Button>
    <Stack>
      <RenderSavedPost/>
    </Stack>
    </Context.Provider>
    </>
  )
}

const RenderSavedPost = () => {
  const { 
    setIsDraftPostOpen,
    posts, setPosts,
    setDraftText,
    setPostIndex,
    agent
  } = useContext(Context);
 let renderedPosts = [];
     console.log("RenderSavedPost posts",posts)
  for(const index in posts) {
    ! isNaN(index) && renderedPosts.push(
    <>
        <Card.Root size="sm">
          <Card.Header>
            <Heading size="md"> Saved Post</Heading>
          </Card.Header>
          <Card.Body color="fg.muted">
          {posts[index]?.text}
          </Card.Body>
          <Stack direction="row">
          <HStack>
        <Button m={1} variant="outline" onClick={() => postingToBsky(agent, posts, index, setPosts)}> Post</Button>
        <Button  
          onClick={
            () =>{ 
              edit(index, posts, setDraftText, setIsDraftPostOpen)
            }
          } 
          padding="20px" variant="outline">Edit</Button>
        <Button  
          onClick={
            () =>{ 
              deletePost(index, posts, setPosts)
            }
          } 
          padding="20px" variant="outline">Delete</Button>
        </HStack>
        </Stack>
      </Card.Root>
      </>
    )
  }

  return(renderedPosts);
}

const DrafPostButton = () => {
  const { 
    isLoginOpen, setIsLoginOpen, 
    isDraftPostOpen, setIsDraftPostOpen,
    posts, setPosts,
    draftText, setDraftText,
    agent
  } = useContext(Context);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  let [charactersLeft, setCharactersLeft] = useState(300);

  return (
    <>
      <DialogRoot open={isLoginOpen}>
      <DialogContent>
        <DialogHeader>
        <DialogTitle>User & Password</DialogTitle>
        </DialogHeader>
        <DialogBody>
        <VStack>
          <Input m={1} 
            value={user}
            onChange={(e) => setUser(e.target.value)} 
            placeholder="tuvieja.bsky.social"
            />
          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </VStack>
   
      </DialogBody>
        <DialogFooter>
          <Button onClick={() => login(agent, user, password, setIsLoginOpen)} variant="outline">Login</Button>
          <DialogActionTrigger asChild>
            <Button onClick={() => setIsLoginOpen(false)} variant="outline">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot> 
    <EditPostDialog/>
    </>
  )
}

const EditPostDialog = () => {
  const { 
    isLoginOpen, setIsLoginOpen, 
    isDraftPostOpen, setIsDraftPostOpen,
    posts, setPosts,
    draftText, setDraftText,
    postIndex,
    agent
  } = useContext(Context);

  let [charactersLeft, setCharactersLeft] = useState((300 - draftText.length));
  const index = postIndex != 0? postIndex : (posts?.last_index || 1 ) + 1;
  
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
              value={draftText}
              colorPalette={charactersLeft >= 0 ? "black" : "red"}
              autoresize 
              onChange={
                (e) => {
                  setDraftText(e.target.value); 
                  setCharactersLeft(300 - draftText.length);
                }
              }
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          />
        </DialogBody>
        <DialogFooter>
          <VStack>
            <HStack>
              <Tag size="sm" colorPalette={charactersLeft >= 0 ? "green" : "red"}>
                {charactersLeft}
              </Tag>
              <Stack m={1}  direction="row" > 
                <Button 
                  onClick={() => savePost(posts, index, draftText, setPosts, setIsDraftPostOpen)} 
                  variant="outline">Save
                </Button>
                {/*<Button onClick={() => postingToBsky(agent, posts, null, setPosts)} variant="outline"> Post </Button>*/}
                </Stack>
                <DialogActionTrigger asChild>
                  <Button 
                  onClick={
                    () => {
                      setIsDraftPostOpen(false);
                      setCharactersLeft(300);
                    }
                  }  variant="outline">Cancel</Button>
              </DialogActionTrigger>
              </HStack>
            </VStack>
        </DialogFooter>
 
      </DialogContent>
    </DialogRoot>
    </>
  )
}

export default App
