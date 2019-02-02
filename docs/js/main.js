const config = {
  apiKey: "AIzaSyCWFb4g7iiYndrM1CPM2_VezjuTBPKlUaA",
  authDomain: "sekai-8fcfd.firebaseapp.com",
  databaseURL: "https://sekai-8fcfd.firebaseio.com",
  projectId: "sekai-8fcfd",
  storageBucket: "sekai-8fcfd.appspot.com",
  messagingSenderId: "713119701258"
};
const firebaseApp = firebase.initializeApp(config);
const app = flamelink({ firebaseApp });

async function getPostsData() {
  let postsData = [];
  let promise = app.content.get('myPosts');
  postsData.push(await promise);
  return postsData[0];
}
async function setPostsDataToArray(posts) {
  let postsArr = [];
  let datas = await posts;
  for(key in datas){
    let content = {
      year: datas[key].date.slice(0,4),
      month: datas[key].date.slice(5,7),
      date: datas[key].date.slice(0,4)+'.'+datas[key].date.slice(5,7),
      title: datas[key].title,
      editor:  datas[key].editor,
      imgId: datas[key].image[0].toString(),
      tech: datas[key].tech
    }
    postsArr.push(content);
  }
  postsArr.sort(function(a,b){
    return b.year - a.year;
  });
  return postsArr;
}

async function setImgUrlToArr(postsArr) {
  let arr = await postsArr;
  for(key in arr) {
    arr[key].imgUrl = await app.storage.getURL(arr[key].imgId);
  }
  return arr;
}

async function show(){
  let postsArr = await setPostsDataToArray(getPostsData());
  postsArr = await setImgUrlToArr(postsArr);
  let elemArr = [];
  for(let i = 0;i<postsArr.length;i++){
    let target = document.createElement('div');
    target.classList.add('post');
    target.innerHTML =
    '<h1>'+ postsArr[i].title +'</h1>'+
    '<h2>'+ postsArr[i].date +'</h2>'+
    '<p>'+ postsArr[i].tech +'</p>'+
    '<a data-lightbox="works" data-title="'+ postsArr[i].title +'" href="'+ postsArr[i].imgUrl +'"><img src="'+ postsArr[i].imgUrl +'"></a>' +
    '<div class="content">'+ postsArr[i].editor +'</div>'+
    '<hr>';
    elemArr.push(target);
  }
  return new Promise(function(resolve) {
    resolve(elemArr);
  })
}
show().then(function(data){
  let postsArea = document.getElementById('posts');
  for(i in data) {
    postsArea.appendChild(data[i]);
  }
  hideLoading();
})