export const savePostOnLocalStorage = (postToSave) => {
    console.log("savePostOnLocalStorage", postToSave)
    localStorage.setItem("busqued.v0.1", JSON.stringify(postToSave))
}
  
export const getPostOnLocalStorage = () => {
    const posts = localStorage.getItem("busqued.v0.1");
    return JSON.parse(posts? posts : "{}");
}