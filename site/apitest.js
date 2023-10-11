let movieId
let name
function setup() {
  createCanvas(400, 400);
  img = createElement("img")
  img.size(150, 200)
  img.position(0,0)
  iDLoad = createInput("")
  iDLoad.attribute("placeholder","#ID")
  iDLoad.value(getItem('load'))
  loadJS()
  comLoad = createInput("")
  comLoad.position(200, 400)
  comLoad.attribute('placeholder','#comment')
  iDButton = createButton('Person ID')
  iDButton.position(0, 430)
  iDButton.mousePressed(loadJS)
  comButton = createButton('Save Comment')
  comButton.position(200, 430)
  comButton.mousePressed(saveCom)
}
function loadJS(){
  movieId = iDLoad.value()
  httpDo("https://api.themoviedb.org/3/person/"+ movieId +"?api_key=f61be177e52665e7c5e6973bb615e517", 'GET', 'json', function(data){
    name = data.name
    img.attribute("src", "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + data.profile_path)
  })
  httpGet('https://keyval.learnscrum.xyz/keystore/'+ movieId +'?apikey=EV9B4A3DLp', function(js){
    comLoad.value(js)
  }, function(){
    comLoad.value('')
  })
  storeItem('load', movieId)
}
function saveCom(){
  httpDo('https://keyval.learnscrum.xyz/keystore/'+ movieId +'?apikey=EV9B4A3DLp',"PUT", 'text', comLoad.value())
}
function draw() {
  background(220)
  textSize(20)
  if (name){text(name, 5, 300)}
}