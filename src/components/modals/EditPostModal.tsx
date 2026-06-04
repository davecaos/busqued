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
import { Avatar } from '@/components/ui/avatar';
import { savePost } from '@/logic/post';

const MAX_POST_TEXT_LENGTH = 300;
const NEAR_LIMIT_THRESHOLD = 20;

const CharRing = ({ value, max }: { value: number; max: number }) => {
  const remaining = max - value;
  const pct = Math.min(value / max, 1);
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);
  const isOver = remaining < 0;
  const isNear = remaining >= 0 && remaining <= NEAR_LIMIT_THRESHOLD;
  const color = isOver
    ? 'var(--bsky-error)'
    : isNear
      ? '#f59e0b'
      : 'var(--bsky-blue)';

  return (
    <span
      className="char-ring"
      aria-label={`${remaining} characters remaining`}
    >
      <svg width="26" height="26" viewBox="0 0 28 28">
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke="var(--bsky-border)"
          strokeWidth="2.5"
        />
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 14 14)"
        />
      </svg>
      {isNear || isOver ? (
        <span className="char-ring__label" style={{ color }}>
          {remaining}
        </span>
      ) : null}
    </span>
  );
};

export const EditPostModal = ({
  isDraftPostOpen,
  setIsDraftPostOpen,
  posts,
  setPosts,
  postIndex,
  authorAvatar,
  authorDisplayName,
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

  const syncPostText = (event) => {
    setPostText(event.currentTarget.value);
  };

  const handlePaste = (event) => {
    const textarea = event.currentTarget;
    requestAnimationFrame(() => {
      setPostText(textarea.value);
    });
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
            <div className="draft-composer">
              <div className="draft-composer__avatar-col">
                <Avatar
                  className="draft-composer__avatar"
                  src={authorAvatar}
                  name={authorDisplayName || 'You'}
                  size="sm"
                />
              </div>
              <div className="draft-composer__textarea-col">
                <Textarea
                  autoresize
                  className="draft-composer__textarea"
                  maxLength={MAX_POST_TEXT_LENGTH}
                  onChange={syncPostText}
                  onInput={syncPostText}
                  onPaste={handlePaste}
                  placeholder="What's on your mind?"
                  rows={5}
                  textStyle="md"
                  value={postText}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="dialog-footer draft-dialog__footer">
            <CharRing value={postText.length} max={MAX_POST_TEXT_LENGTH} />
            <HStack className="dialog-actions">
              <Button
                colorPalette="blue"
                disabled={!canSave}
                type="submit"
                variant="solid"
              >
                {postIndex != 0 ? 'Save' : 'Save Draft'}
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
