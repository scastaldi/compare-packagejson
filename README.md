# compare-packagejson
This is a simple program to make sure all your related repos have the same package version
For example, you have multiple micro-services and you want to make sure that they all have the same versions 

All you need to to run this program point to root of the folder where all the repos are located (hopefully in the same path)

You do not need to npm install or import any dependencies, is just plain javascript, 
I wanted to make sure I didn't need a package.json for this project :) 

I put this code together really quick, please feel free to create pull requests with improvements, in the near future I want to extend it to also check package-lock.json files

e.g. 
```
/rootfolder/(put the index.js here)
/rootfolder/repo1
/rootfolder/repo2
/rootfolder/...
```

You can also have index.js in your prefer location and pass the path as parameter

e.g. 
```
node index.js '/Users/scastaldi/git/myproject/'
```   
![Alt Text](compare-packagejson-demo.gif)