/**
 * Scene constructor.
 * @param {object} sceneData - property of simple scene from map.json
 *                             i.e. {"floorNumber": 1,"sceneNumber": 12,"pictures": []}
 */
function Sceene(sceneData) {
  
  // Variables that position the panorama.
  this.x = 0;
  this.y = 0;
  // Variables of the current cursor position.
  this.px = 0;
  this.py = 0;
  // Coefficients of how far the panoramas has to be moved.
  this.dx = 0;
  this.dy = 0;

  /* 
    Alpha channel for the shadow effect, by default set to total blackout.
  */
  this.shadow = 255;
  
  // Flag that allows to darken or brighten the image (shadow).
  this.allowFade = false;
  
  // Array of views.
  this.views = [];

  for (let viewIndex = 0; viewIndex < 4; viewIndex++){
    this.views.push(new View(sceneData, viewIndex, sceneData.pictures));
  }
  
  /**
  * A function that moves the panorama horizontally and vertically with no to 
  * interference the screen borders.
  * At the same time, the display functions for individual views are called up.
  */
  this.updateView = () => {

    // mouseIsPressed - boolean system variable which detects if mouse is pressed
    // mouseX/mouseY - contains the current horizontal/vertical position of the mouse, 
    // relative to (0, 0) of the canvas
    if (mouseIsPressed){
      this.dx = (mouseX - this.px) / 1;
      this.dy = (mouseY - this.py) / 1;
    }
    
    this.px = mouseX;
    this.py = mouseY;
    this.dx *= 0.88;
    this.dy *= 0.88;
    
    this.x += this.dx;
    this.y += this.dy;
    
    if (this.x >= this.views[0].width * 2){ 
      this.x = -this.views[0].width * 2 + 1; 
    }
    else if (this.x <= -this.views[0].width * 2){ 
      this.x = this.views[0].width * 2 - 1; 
    }
    
    if (this.y + this.dy < -(this.views[0].height-height) / 2 - 1){ 
      this.y = -(this.views[0].height  -height) / 2; 
    }
    else if (this.y + this.dy > (this.views[0].height - height) / 2 - 1){ 
      this.y = (this.views[0].height - height) / 2; 
    }
    
    for(let i = 0; i < 4; i++){
      this.views[i].move(this.x, this.y);
      this.views[i].render();
    };

    fill(0, this.shadow);
    rect(0, 0, width, height);
  }
  
  /**
  * Image scaling function, accepting as an argument:
  * @delta - value added to the height and width in the right proportions
             - good value is around 20
  */
  this.scale = (delta) => {
    for (i=0; i<4; i++){
      this.views[i].scale(delta);
    };
  }
  
  /**
   * Function that checks if there was a click on the active element in one of views. 
   * He accepts as arguments:
   * @mouseX - x-coordinate mouse click
   * @mouseY - y-coordinate mouse click
   * and returns:
   * @false - if there was no click on an active element
   * @object {newSceen: <...>, newView: <...>}:
    *  @newSceen - index of the new Scene
    *  @newView - index of the new View
   */
  this.click = (mouseX, mouseY) => {
    for (i=0; i<4; i++){
      const tempView = this.views[i].click(mouseX, mouseY);

      if (tempView.newSceen){ 
        return this.views[i].click(mouseX, mouseY); 
      }
    };

    return false;
  }
  
 /**
  * Function that makes the image darker after each view being refreshed.
  * To expire the image, it's necessary to call this function until the shadow
  * variable reaches the value 255. At the initialization the flag of the
  * blanking/brightening permit is reset.
  */
  this.fadeOut = () => {
    if (this.shadow < 247) {
      this.shadow += 7;
    }
    else {
      this.shadow = 255;
      this.allowFade = false;
    }
  }
  
 /**
  * Function that makes the image brighter with each view refreshment.
  * In order to show the image, it's necessary to call this function until 
  * the shadow variable reaches the value 0. At the initialization the flag of 
  * the blanking/brightening permit is reset.
  * The function accepts the following parameter:
  * @pos - view index, on which the scene will be centered during and after appearing
  */
  this.fadeIn = (destinationSceneIndex) => {
    if (destinationSceneIndex < 3){
      destinationSceneIndex = destinationSceneIndex;
    }
    else {
      destinationSceneIndex = -1;
    }
    this.x = -destinationSceneIndex * this.views[0].width;

    if (this.shadow > 8) {
      this.shadow -=7 ;
    }
    else {
      this.shadow = 0;
      this.allowFade = false;
    }
  }
}