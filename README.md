#Raymarching workshop utilities

##Slides: https://drive.google.com/a/perk.com/file/d/0BzYXVLhOKPPTdGVqQkVDQTVKak0/view

public/js/raymarch.js -- lets you configure which fragment shader you would like to use.
public/glsl/raymarch_1.glsl -- completed scene
public/glsl/raymarch_base.glsl -- case scene with a raymarcher and an empty scene to work from

switch the path in the below snippet (inside raymarch.js) to glsl/raymarch_1.glsl if you wish to view the completed scene.

      {
        "path" : "glsl/raymarch_base.glsl",
        "name" : "fragment_toy"
      },
      
# running (requires nodejs to spoolup)

npm install express -g
npm start




