## Virtual-Tour-p5.js

Master's project of an application built on the basis of the p5.js library, which enables a virtual tour of the AEI faculty of the Silesian University of Technology.

**Demo**

https://mburyrr.github.io/Virtual-Tour-p5-js/

**Running App**

To run the application, you must have a local server that runs files from the given directory under *localhost*.
After that, all you need to do is enter the following in your browser:

`http://localhost:<port>/<path_to_app>/index.html>`

**Add new scenes**

1.  Prepare pictures 
    - pictures are placed in folders dedicated to the appropriate floors
        >/p<floor_number>/

    - the default naming of the picture is: 
        >p<floor_number>__<scene_number> __<picture_number>

        (i.e. *p1_1_2*)
2.  Complete the dependency map (`/json/map.json`) for the parameters of the active elements:
    - pictures field should always contain four elements
    - if some destination scene doesn't exist fill values with `null`
    &nbsp;
    ```
    {
		"floorNumber": <floor_number>,
		"sceneNumber": <scene_number>,
		"pictures": [
			{
				"stairs": <if_stairs_exist>,
				"floorNumber": <next_floor_number>,
				"sceneNumber": <next_scene_number>,
				"pictureNumber": <next_picture_number>
			},
			{
				"stairs": <if_stairs_exist>,
				"floorNumber": <next_floor_number>,
				"sceneNumber": <next_scene_number>,
				"pictureNumber": <next_picture_number>
			},
			{
				"stairs": <if_stairs_exist>,
				"floorNumber": <next_floor_number>,
				"sceneNumber": <next_scene_number>,
				"pictureNumber": <next_picture_number>
			},
			{
				"stairs": <if_stairs_exist>,
				"floorNumber": <next_floor_number>,
				"sceneNumber": <next_scene_number>,
				"pictureNumber": <next_picture_number>
			}
		]
	}
```
