// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Card, Heading } from '@chakra-ui/react';

const Post = ({ text, postToBluesky, editDraft, deleteDraft }) => {
  return (
    <Card.Root className="post-card" size="sm">
      <div className="post-card__content">
        <Card.Header className="post-card__header">
          <Heading className="post-card__title" size="sm">
            Saved Draft
          </Heading>
        </Card.Header>
        <Card.Body className="post-card__body" color="fg.muted">
          {text}
        </Card.Body>
        <div className="post-card__actions">
          <Button colorPalette="blue" onClick={postToBluesky} type="button">
            Post
          </Button>
          <Button
            colorPalette="blue"
            onClick={editDraft}
            type="button"
            variant="subtle"
          >
            Edit
          </Button>
          <Button
            colorPalette="blue"
            onClick={deleteDraft}
            type="button"
            variant="subtle"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card.Root>
  );
};

export default Post;
