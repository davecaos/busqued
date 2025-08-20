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
import { loginWithoutsavedCredentials} from "@/logic/login";

export const LoginModal = ({
    isLoginOpen,
    setIsLoginOpen,
    agent,
  }) => {

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
              <Input
                m={1}
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
            <Button
              onClick={() => {
                loginWithoutsavedCredentials(agent, user, password);
                setIsLoginOpen(false);
              }}
              variant="outline"
            >
              Login
            </Button>
            <DialogActionTrigger asChild>
              <Button onClick={() => setIsLoginOpen(false)} variant="outline">
                Cancel
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>

    </>
  );
};

