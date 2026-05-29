// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Text } from '@chakra-ui/react';
import { postingToBsky, editDraft, deleteDraft } from '@/logic/post';
import Post from './Post';

const Posts = ({ postsState, setPostsState }) => {
  const setPosts = (posts) => setPostsState({ posts });
  const setPostIndex = (postIndex) => setPostsState({ postIndex });
  const setIsDraftPostOpen = (isDraftPostOpen) =>
    setPostsState({ isDraftPostOpen });

  const draftIndexes = Object.keys(postsState.posts)
    .filter((index) => !Number.isNaN(Number(index)))
    .sort((a, b) => Number(b) - Number(a));

  if (draftIndexes.length === 0) {
    return (
      <Text className="empty-state" color="fg.muted">
        No saved drafts yet.
      </Text>
    );
  }

  return (
    <section className="posts-grid" aria-label="Saved drafts">
      {draftIndexes.map((index) => {
        const handlePostToBluesky = async () => {
          if (!postsState.isLoggedIn) {
            setPostsState({
              isLoginOpen: true,
              loginError: 'Log in to post this draft to Bluesky.',
            });
            return;
          }

          try {
            await postingToBsky(
              postsState.agent,
              postsState.posts,
              index,
              setPosts
            );
          } catch {
            setPostsState({
              isLoginOpen: true,
              isLoggedIn: false,
              loginError: 'Could not post. Please sign in again.',
            });
          }
        };

        const handleEditDraft = () => {
          editDraft(index, setPostIndex, setIsDraftPostOpen);
        };
        const handleDeleteDraft = () => {
          deleteDraft(index, postsState.posts, setPosts);
        };
        return (
          <Post
            key={index}
            text={postsState.posts[index]?.text}
            postToBluesky={handlePostToBluesky}
            editDraft={handleEditDraft}
            deleteDraft={handleDeleteDraft}
          />
        );
      })}
    </section>
  );
};

export default Posts;
