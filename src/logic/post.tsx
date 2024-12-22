// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { savePostOnLocalStorage } from "@/logic/localstorage";

export const postingToBsky = async (agent, posts, index, setPosts) => {
  index = Number(index);
  await agent.post({
    text: posts[index]?.text,
    createdAt: new Date().toISOString(),
  });

  deletePost(index, posts, setPosts);
  //delete posts[index];
  //setPosts({ ...posts});
  //savePostOnLocalStorage(posts);
};

export const deletePost = (index, posts, setPosts) => {
  delete posts[index];
  setPosts({ ...posts });
  savePostOnLocalStorage(posts);
};

export const edit = (
  index,
  posts,
  setPostIndex,
  setDraftText,
  setIsDraftPostOpen,
) => {
  setDraftText(posts[index]?.text);
  setPostIndex(index);
  setIsDraftPostOpen(true);
};

export const savePost = async (
  posts,
  index,
  draftText,
  setPosts,
  setIsDraftPostOpen,
) => {
  posts.last_index = index > posts.last_index ? index : posts.last_index;
  posts[index] = { text: draftText };

  setPosts(posts);
  savePostOnLocalStorage(posts);
  setIsDraftPostOpen(false);
};

export const login = async (agent, user, password, setIsLoginOpen) => {
  var credential: any = new PasswordCredential({
    id: user,
    password: password,
    name: user,
    iconURL: "https://bsky.app/profile/" + user,
  });

  await navigator.credentials.store(credential);

  let _login = await agent.login({
    identifier: user,
    password: password,
  });

  setIsLoginOpen(false);
};
