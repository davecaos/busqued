// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export const login = async (agent, user, password, setIsLoginOpen) => {
 /* var credential: any = new PasswordCredential({
    id: user,
    password: password,
    name: user,
    iconURL: "https://bsky.app/profile/" + user,
  });*/

//await navigator.credentials.store(credential);
 console.log("login", agent)
 console.log("login",user)
 console.log("login", password)
  let _login = await agent.login({
    identifier: user,
    password: password,
  });
  console("_login", _login)
  setIsLoginOpen(false);
};

export const loginWithoutsavedCredentials = async (agent, user, password, setIsLoginOpen) => {
  var credential: any = new PasswordCredential({
    id: user,
    password: password,
    name: user,
    iconURL: "https://bsky.app/profile/" + user,
  });

await navigator.credentials.store(credential);
 console.log("login", agent)
 console.log("login",user)
 console.log("login", password)
  let _login = await agent.login({
    identifier: user,
    password: password,
  });
  console("_login", _login)
  setIsLoginOpen(false);
};
