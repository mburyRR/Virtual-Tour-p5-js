let mapData = [];
let mapIndexes = [];
let scenes = []; // all scenes
let next = { scene: '', viewIndex: 0 };
let allowFade = true;
let destinationSceneIndex = 0;
let activeSceneIndex = 10; // Initial scene number

/**
 * Function called before setup(). 
 * It's used to asynchronous data fetching.
 */
function preload() {
  mapData = loadJSON('./json/map.json');
}

/**
 * Function which is called once when the program starts. 
 * It's used to define initial environment properties.
 */
function setup() {

  // Create a canvas element and sets the dimensions of it in pixels.
  createCanvas(windowWidth, windowHeight);

  // Convert received map object to array
  mapData = Object.values(mapData).map(value => value);
  mapData.forEach(sceneData => {
    scenes.push(new Sceene(sceneData));
    mapIndexes.push(sceneData.floorNumber * 100 + sceneData.sceneNumber);
  })

  next = { scene: activeSceneIndex + 1, viewIndex: 0 };
  scenes[activeSceneIndex].shadow = 0;
}

/**
 * Function called directly after setup().
 * Continuously executes the lines of code contained inside its block until the program is stopped.
 */ 
function draw() {
  // Function that sets the color used for the background of the p5.js canvas.
  background(0);

  if (!scenes[activeSceneIndex].allowFade && activeSceneIndex !== mapIndexes.indexOf(next.scene)) {
    activeSceneIndex = mapIndexes.indexOf(next.scene);
    destinationSceneIndex = next.viewIndex - 1;
    scenes[activeSceneIndex].allowFade = true;
    allowFade = true;
  }
  if (allowFade && scenes[activeSceneIndex].allowFade){
    scenes[activeSceneIndex].fadeIn(destinationSceneIndex);
  }
  else if (!allowFade && scenes[activeSceneIndex].allowFade){
    scenes[activeSceneIndex].fadeOut();
  }
  scenes[activeSceneIndex].updateView();
}

/**
 * Actions called when mouse is clicked
 */
function mouseClicked() {
  // Check if clicked on active navigation element
  const clickedOnElement = scenes[activeSceneIndex].click(mouseX, mouseY);

  if (clickedOnElement !== false){
    scenes[activeSceneIndex].allowFade = true;
    allowFade = !allowFade;
    next.scene = clickedOnElement.newSceen;
    next.viewIndex = clickedOnElement.newView;
    allowFade = false;
  }
}

/**
 * Actions called every time when mouse wheel changed position
 */
function mouseWheel(event) {
  scenes[activeSceneIndex].scale(-event.delta / 2);
}