// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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