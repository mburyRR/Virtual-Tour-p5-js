/**
 * Scene constructor.
 * @sceneData - scene data from map.json, in which current view is part
 * @viewIndex - view index - (0,1,2,3)
 * @next - index table of subsequent scenes for individual views
 * @stairsF - flag of the stairs occurence
*/
function View(sceneData, viewIndex, next)
{  
  // Image variables and its parameters
  this.img = loadImage('img/p'+str(sceneData.floorNumber) +
                    '/p' + str(sceneData.floorNumber) + '_' +
                    str(sceneData.sceneNumber) + '_' + str(viewIndex+1)+'.jpg');
  this.height = windowHeight;
  this.width = windowWidth;
  
  // Min and Max image sizes
  this.minHeight = this.height;
  this.minWidth = this.width;
  this.maxHeight = this.height*10;
  this.maxWidth = this.width*10;
  
  // Navigation indexes
  this.stairsF = next[viewIndex].stairs;
  this.overInd = null;
  this.over = false;
  this.selfInd = viewIndex;
  this.nextInd = null;
  this.nextInd2 = null;

  // The position of the center of the current view in relation to the whole panorama
  this.posY = 0;
  this.posX = (viewIndex!=3) ? this.width * this.selfInd : -this.width;

  // Hotspots parameters
  this.button={width: 100, height: 75, off: 0};
  this.button2={width: 100, height: 75, off: 100}


  if (this.stairsF){
    this.overInd = (viewIndex + 2 < 4) ? viewIndex + 2 : viewIndex - 2;
  }
  if (viewIndex + 2 < 4){
    this.over = next[viewIndex+2].stairs;
  }
  else {
    this.over = next[viewIndex-2].stairs;
  }
  if (next[viewIndex].floorNumber != null) {
    this.nextInd = next[viewIndex].floorNumber * 10000 + next[viewIndex].sceneNumber * 100 +
    next[viewIndex].pictureNumber;
  }
  if (this.overInd != null && next[this.overInd].floorNumber != null){
    this.nextInd2 = next[this.overInd].floorNumber * 10000 +
    next[this.overInd].sceneNumber * 100 + next[this.overInd].pictureNumber;
  }
  if (this.stairsF){
    this.button.off =- 100;
  }

  /*
  * Function that renders view on screen - it draws pictures and hotspots on the screen
  */
  this.render = () => {
    push();
    imageMode(CENTER);
    rectMode(CENTER);
    translate(width/2, height/2);
    image(this.img, this.posX, this.posY, this.width, this.height);
    fill(255, 100);
    noStroke();
    
    if (!this.over){
      if(this.nextInd != null) rect(this.posX + this.button.off, this.posY, this.button.width, this.button.height);
      if(this.nextInd2 != null) rect(this.posX + this.button2.off, this.posY, this.button2.width, this.button2.height);
    }

    pop();
  }
  
 /**
  * Function that scales the image vertically and horizontally according to scroll.
  * @delta - the difference which image should be enlarged or reduced
  */
  this.scale = (delta) => {
    const widthHeightRatio = this.width / this.height;

    this.height = (this.height + delta <= this.maxHeight) ? this.height+delta : this.maxHeight;
    this.height = (this.height + delta >= this.minHeight) ? this.height+delta : this.minHeight;
    
    this.width = (this.width + delta * widthHeightRatio <= this.maxWidth) ? this.width+delta*widthHeightRatio : this.maxWidth;
    this.width = (this.width + delta * widthHeightRatio >= this.minWidth) ? this.width+delta*widthHeightRatio : this.minWidth;
  }
  
 /**
  * Function taht deals with moving the view of the set values
  * @nx - position of the slider horizontally
  * @ny - position of the slider vertically
  */
  this.move = (nx, ny) => {

    this.posX = nx + this.selfInd * this.width;

    if (this.posX > this.width * 2 && this.selfInd == 1){
      this.posX = nx - 3 * this.width;
    }
    else if (this.posX > this.width * 2 && this.selfInd == 3){
      this.posX = nx - this.width;
    }
    else if (this.posX > this.width * 2 && this.selfInd == 2){
      this.posX = nx - 2 * this.width;
    }
    
    this.posY = ny;
  }
  
 /**
  * Function that checks if there was a click on the hotspot element.
  * @mouseX - x-coordinate mouse click
  * @mouseY - y-coordinate mouse click
  * and returns:
   * @false - if there was no click on an active element
   * @object {newSceen: <...>, newView: <...>}:
    *  @newSceen - index of the new Scene
    *  @newView - index of the new View
  */
  this.click = (mouseX, mouseY) => {

    mouseX-=width/2;
    mouseY-=height/2;

    const condition1 = this.posX - this.button.width / 2 + this.button.off;
    const condition2 = this.posX + this.button.width / 2 + this.button.off;
    const condition3 = this.posY - this.button.height / 2;
    const condition4 = this.posY + this.button.height / 2;

    const condition5 = this.posX - this.button2.width / 2 + this.button2.off;
    const condition6 = this.posX + this.button2.width / 2 + this.button2.off;
    const condition7 = this.posY - this.button2.height / 2;
    const condition8 = this.posY + this.button2.height / 2;

    if (this.over){ 
      return false; 
    }
    if (mouseX > condition1 && mouseX < condition2 && mouseY > condition3 && mouseY < condition4){
      return {newSceen: floor(this.nextInd / 100), newView: this.nextInd % 100};
    }
    if (mouseX > condition5 && mouseX < condition6 && mouseY > condition7 && mouseY < condition8 && this.stairsF){
      return {newSceen: floor(this.nextInd2 / 100), newView: this.nextInd2 % 100};
    }
    return false;
  }
}