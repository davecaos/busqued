// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { savePostOnLocalStorage } from '@/logic/localstorage';

export const postingToBsky = async (agent, posts, index, setPosts) => {
  index = Number(index);
  const text = posts[index]?.text?.trim();

  if (!text) {
    return;
  }

  await agent.post({
    text,
    createdAt: new Date().toISOString(),
  });

  deleteDraft(index, posts, setPosts);
};

export const deleteDraft = (index, posts, setPosts) => {
  const nextPosts = { ...posts };
  delete nextPosts[index];
  setPosts(nextPosts);
  savePostOnLocalStorage(nextPosts);
};

export const editDraft = (index, setPostIndex, setIsDraftPostOpen) => {
  setPostIndex(index);
  setIsDraftPostOpen(true);
};

export const savePost = async (
  posts,
  index,
  draftText,
  setPosts,
  setIsDraftPostOpen
) => {
  const nextPosts = {
    ...posts,
    last_index: Math.max(Number(index), Number(posts.last_index || 0)),
    [Number(index)]: { text: draftText.trim() },
  };

  setPosts(nextPosts);
  savePostOnLocalStorage(nextPosts);
  setIsDraftPostOpen(false);
};
