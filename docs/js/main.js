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

  function getPostsData() {
    return app.content.get('myPosts');
  }
  function setPostsDataToArray(promise) {
    let postsArr = [];
    promise.then( posts =>{
      for(let i in posts) {
        let content = {
          year: posts[i].date.slice(0,4),
          month: posts[i].date.slice(5,7),
          date: posts[i].date.slice(0,4)+'.'+posts[i].date.slice(5,7),
          title: posts[i].title,
          editor:  posts[i].editor,
          imgId: posts[i].image[0].toString(),
          tech: posts[i].tech
        }
        postsArr.push(content);
      }
    }).then(function(){
      postsArr.sort(function(a,b){
        return b.year - a.year;
      });
    });
    return postsArr;
  }
  async function getImgUrlArr(promiseArr) {
    let result = [];
    for(let i = 0;i<promiseArr.length;i++) {
      result[i] = await promiseArr[i]
    }
    return result;
  }

  let postsData = [];
  new Promise(function(resolve){
    setTimeout(function(){
      resolve(0);
    },500);
  })
  .then(function(postsData){
    return new Promise(function(resolve) {
      setTimeout(function(){
        postsData = setPostsDataToArray(getPostsData());
        resolve(postsData);
      },200)
    });
  })
  .then(function(postsData){
    return new Promise(function(resolve){
      setTimeout(function(){
        for(let i in postsData) {
          postsData[i].imgUrl = app.storage.getURL(postsData[i].imgId);
        }
        resolve(postsData);
      },200);
    });
  })
  .then(function(postsData){
    let values = [];
    return new Promise(function(resolve) {
      setTimeout(function(){
        for(let i in postsData) {
          values.push(app.storage.getURL(postsData[i].imgId));
        }
        resolve([postsData,values]);
      },200);
    });
  })
  .then(function(result){
    let promiseArr = getImgUrlArr(result[1]);
    let value;
    return new Promise(resolve=>{
      setTimeout(()=>{
        value = 
          promiseArr.then(value=>{
            for(let i = 0;i<result[1].length;i++) {
              result[0][i].imgUrl = value[i];
            }
            return result[0];
          })
        resolve(value)
      },200)
    })
  })
  .then(postsData=>{
    let postsArea = document.getElementById('posts');
    for(let i = 0;i<postsData.length;i++){
      let target = document.createElement('div');
      target.classList.add('post');
      target.innerHTML =
      '<h1>'+ postsData[i].title +'</h1>'+
      '<h2>'+ postsData[i].date +'</h2>'+
      '<p>'+ postsData[i].tech +'</p>'+
      '<a data-lightbox="works" data-title="'+ postsData[i].title +'" href="'+ postsData[i].imgUrl +'"><img src="'+ postsData[i].imgUrl +'"></a>' +
      '<div class="content">'+ postsData[i].editor +'</div>'+
      '<hr>';
      postsArea.appendChild(target);
    }
  });