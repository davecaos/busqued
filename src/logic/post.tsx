// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { savePostOnLocalStorage } from "@/logic/localstorage"

export const postingToBsky = async (agent, posts, key, setPosts) => {
  key = Number(key)
  await agent.post({
    text: posts[key]?.text,
    createdAt: new Date().toISOString()
  })
  
  delete posts[key];
  setPosts({ ...posts}); 
  savePostOnLocalStorage(posts);
}

export const edit = (index, posts, setDraftText, setIsDraftPostOpen) => {
    setDraftText(posts[index]?.text);
    setIsDraftPostOpen(true)
  }

export const savePost = async (posts, draftText, setPosts, setIsDraftPostOpen) => {
  console.log("savePost IN")
  console.log(posts)
  const next_index = (posts?.last_index || 0 ) + 1;
  console.log("next_index :",next_index)
  posts[next_index] = {text: draftText};
  posts.last_index = next_index;
  
  setPosts(posts); 
  savePostOnLocalStorage(posts);
  setIsDraftPostOpen(false)
}

export const login = async (agent, user, password, setIsLoginOpen) => {
  console.log(user,password)
  
  var credential:any = new PasswordCredential({
    id: user,
    password: password,
    name: user,
    iconURL: 'https://bsky.app/profile/' + user,
  });

  await navigator.credentials.store(credential);

  console.log("agent",agent)
  let _login = (await agent.login({
    identifier: user,
    password: password
  }));

  console.log("login",_login)
  setIsLoginOpen(false);
}