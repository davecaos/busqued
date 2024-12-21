// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export const login = async (agent, user, password, setIsLoginOpen) => {
  
  var credential:any = new PasswordCredential({
    id: user,
    password: password,
    name: user,
    iconURL: 'https://bsky.app/profile/' + user,
  });

  await navigator.credentials.store(credential);

  let _login = (await agent.login({
    identifier: user,
    password: password
  }));

  setIsLoginOpen(false);
}