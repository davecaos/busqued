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
import { PasswordInput } from "@/components/ui/password-input";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@chakra-ui/react";

const Post = ({ text, postToBluesky, editDraft, deleteDraft}) => {
    return (
    <>
        <Card.Root size="sm">
        <Card.Header>
            <Heading size="md"> Saved Post</Heading>
        </Card.Header>
        <Card.Body color="fg.muted">{text}</Card.Body>
        <Stack direction="row">
            <HStack>
            <Button
                m={1}
                variant="outline"
                onClick={postToBluesky}
            >
                Post
            </Button>
            <Button
                onClick={editDraft}
                padding="20px"
                variant="outline"
            >
                Edit
            </Button>
            <Button
                onClick={deleteDraft}
                padding="20px"
                variant="outline"
            >
                Delete
            </Button>
            </HStack>
        </Stack>
        </Card.Root>
    </>
    );
};

export default Post;