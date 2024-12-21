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
import { postingToBsky, savePost, edit } from "@/logic/post"
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
  'last_index': 0,
  0: {text: "el fascismo no se detiene, avanza, ocupa todo y luego explota solo. los que quedan despu\u00E9s dicen \"yo no sab\u00EDa nada\" y se civilizan un tiempo, hasta que el horror se diluye.\nCarlos Busqued"}
};


const App = () => {
  let [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  let [isDraftPostOpen, setIsDraftPostOpen] = useState<boolean>(false);
  const savedPosts = getPostOnLocalStorage();
  console.log(savedPosts)
  let [posts, setPosts] = useState({...LOREM_IPSUM, ...savedPosts});
  console.log(posts)
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
          console.log("credentials>>")
          console.log(credentials)
          setPassword(credentials.password);
          setUser(credentials.name);
          login(agent, user, password, setIsLoginOpen)
        } else {
          console.log("getCredentials")
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
          agent
        }
      }>
    <Title/>
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
    agent
  } = useContext(Context);
 let renderedPosts = [];
    
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
        <Button  onClick={() => edit(index, posts, setDraftText, setPosts, setIsDraftPostOpen)} padding="20px" variant="outline">Edit</Button>
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



    <DialogRoot open={isDraftPostOpen}>
      <DialogTrigger asChild>
        <Button colorPalette="blue" variant="subtle" m={2} onClick={() => setIsDraftPostOpen(true)} size="sm">
        Neu Draft Post!
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Draf Post</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Textarea
              colorPalette={charactersLeft >= 0 ? "black" : "red"}
              autoresize 
              onChange={
                (e) => {
                  setDraftText(e.target.value); 
                  setCharactersLeft(300 - e.target.value.length);
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
                  onClick={() => savePost(posts, draftText, setPosts, setIsDraftPostOpen)} 
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
