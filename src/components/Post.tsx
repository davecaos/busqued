import { IconButton } from '@chakra-ui/react';
import { LuSend, LuPencil, LuTrash2 } from 'react-icons/lu';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip } from '@/components/ui/tooltip';

interface PostProps {
  text: string;
  createdAt?: string;
  postToBluesky: () => void;
  editDraft: () => void;
  deleteDraft: () => void;
  authorAvatar?: string;
  authorDisplayName?: string;
  authorHandle?: string;
}

function formatRelative(iso: string): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) {
    return '';
  }
  const diffMin = Math.floor((Date.now() - time) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  return `${Math.floor(diffH / 24)}d`;
}

const Post = ({
  text,
  createdAt,
  postToBluesky,
  editDraft,
  deleteDraft,
  authorAvatar,
  authorDisplayName,
  authorHandle,
}: PostProps) => {
  const displayName = authorDisplayName || authorHandle || 'Draft';
  const handle = authorHandle ? `@${authorHandle}` : null;
  const relativeTime = createdAt ? formatRelative(createdAt) : '';

  return (
    <article className="post-card">
      <div className="post-card__layout">
        <div className="post-card__avatar-col">
          <Avatar
            className="post-card__avatar"
            src={authorAvatar}
            name={displayName}
            size="sm"
          />
        </div>
        <div className="post-card__content">
          <div className="post-card__identity">
            <span className="post-card__display-name">{displayName}</span>
            {handle ? <span className="post-card__handle">{handle}</span> : null}
            {relativeTime ? (
              <span className="post-card__timestamp">{relativeTime}</span>
            ) : null}
          </div>
          <p className="post-card__body">{text}</p>
          <div
            className="post-card__actions"
            role="toolbar"
            aria-label="Draft actions"
          >
            <div className="post-card__draft-actions">
              <Tooltip content="Post to Bluesky" showArrow>
                <IconButton
                  aria-label="Post to Bluesky"
                  className="post-card__action-icon"
                  colorPalette="blue"
                  onClick={postToBluesky}
                  size="sm"
                  variant="ghost"
                >
                  <LuSend />
                </IconButton>
              </Tooltip>
              <Tooltip content="Edit draft" showArrow>
                <IconButton
                  aria-label="Edit draft"
                  className="post-card__action-icon"
                  onClick={editDraft}
                  size="sm"
                  variant="ghost"
                >
                  <LuPencil />
                </IconButton>
              </Tooltip>
              <Tooltip content="Delete draft" showArrow>
                <IconButton
                  aria-label="Delete draft"
                  className="post-card__action-icon"
                  colorPalette="red"
                  onClick={deleteDraft}
                  size="sm"
                  variant="ghost"
                >
                  <LuTrash2 />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;
