// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HStack, Textarea } from '@chakra-ui/react';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tag } from '@/components/ui/tag';
import { savePost } from '@/logic/post';

const MAX_POST_TEXT_LENGTH = 300;

export const EditPostModal = ({
  isDraftPostOpen,
  setIsDraftPostOpen,
  posts,
  setPosts,
  postIndex,
}) => {
  const index =
    postIndex != 0 ? Number(postIndex) : Number(posts?.last_index || 1) + 1;
  const [postText, setPostText] = useState('');
  const charactersLeft = MAX_POST_TEXT_LENGTH - postText.length;
  const canSave = postText.trim().length > 0 && charactersLeft >= 0;

  useEffect(() => {
    if (isDraftPostOpen) {
      setPostText(posts[index]?.text ?? '');
    }
  }, [index, isDraftPostOpen, posts]);

  const closeModal = () => {
    setIsDraftPostOpen(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    savePost(posts, index, postText, setPosts, setIsDraftPostOpen);
  };

  return (
    <DialogRoot
      open={isDraftPostOpen}
      onOpenChange={(details) => setIsDraftPostOpen(details.open)}
    >
      <DialogContent className="draft-dialog">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>
              {postIndex != 0 ? 'Edit Draft' : 'New Draft'}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Textarea
              autoresize
              maxLength={MAX_POST_TEXT_LENGTH}
              onChange={(e) => {
                setPostText(e.target.value);
              }}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
              rows={6}
              textStyle="md"
              value={postText}
            />
          </DialogBody>
          <DialogFooter className="dialog-footer draft-dialog__footer">
            <Tag size="sm" colorPalette={charactersLeft >= 0 ? 'green' : 'red'}>
              {charactersLeft}
            </Tag>
            <HStack className="dialog-actions">
              <Button
                colorPalette="blue"
                disabled={!canSave}
                type="submit"
                variant="solid"
              >
                Save
              </Button>
              <Button onClick={closeModal} type="button" variant="outline">
                Cancel
              </Button>
            </HStack>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
};
