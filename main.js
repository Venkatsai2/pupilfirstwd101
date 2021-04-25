var c=document.getElementById("my-canvas");
var ctx=c.getContext("2d");

let loadImage = (source,callback) => {
    let img = new Image();
    img.onload = () => callback(img) ;
    img.src = source; 
};




///setting background for canvas 
var background = new Image();
background.src = "images/background.jpg";

background.onload = function(){
    ctx.drawImage(background,0,0,1350,900);   
}
//background setted



let imagePath = (frameNumber,animationname) => {
    return "images/"+animationname+"/"+frameNumber+".png";
};

let framesofanimations ={
    idle:[1,2,3,4,5,6,7,8],
    kick:[1,2,3,4,5,6,7],
    punch:[1,2,3,4,5,6,7],
    backward:[1,2,3,4,5,6],
    block:[1,2,3,4,5,6,7,8,9],
    forward:[1,2,3,4,5,6]
};



let loadAllImages = (callback) => {

    let loadedimages={idle:[],kick:[],punch:[],backward:[],block:[],forward:[]};
    let imagesToLoadCount = 0;

    ["idle","kick","punch","backward","block","forward"].forEach((animationname)=>{
        let animationFrame=framesofanimations[animationname];
        imagesToLoadCount=imagesToLoadCount+ animationFrame.length ;

        animationFrame.forEach((frameNumber)=>{
            let path=imagePath(frameNumber,animationname);
            //writing the below loop for iterating for three animations instead of 1 previously (idle) --> kick,punch
            loadImage(path,(image)=>{
                loadedimages[animationname][frameNumber-1]=image;
                imagesToLoadCount=imagesToLoadCount-1;
                if(imagesToLoadCount==0){
                    callback(loadedimages);
                }
            });

        });

    });
    /*
     //iteraring on all images
     [1,2,3,4,5,6,7,8].forEach((frameNumber) =>{
         let path=imagePath(frameNumber);
         console.log(frameNumber+ "   "+path);
         //loading present image
         loadImage(path, (image) => {
             loadedimages[frameNumber-1]=image;
             imagesLoadCount=imagesLoadCount-1;

             if(imagesLoadCount === 0){
                 //calling our callback in loadAllImages
                 callback(loadedimages);
             }

         });

     });
     */

};


let positionxofimg=0;

//timer for stop recursion
var timer;
//in animate we are changing loadedimages to loadedimages[animationname]
//because at every laod we are caling a callback in our loadAllImages function

let animate = (ctx,loadedimages,animationname,callback) => {
    //here changes
    loadedimages[animationname].forEach(
        (image,index) => {
            //for eachimage setting time delay
            setTimeout(()=>{
                //without this we tested then all the images are overlapping so we are clearing 
                //before next image comes
                background.onload();

                ctx.clearRect(positionxofimg,400,500,500);

                ctx.drawImage(image,positionxofimg,400,500,500);

            },index*100);
        }
    );
    //here changes
    setTimeout(callback,loadedimages[animationname].length*100);
};


var clickedvalues ={
    idle:0,
    kick:0,
    punch:0,
    backward:0,
    forward:0,
    block:0
};

/*
function endcall2(){
     
    let text="";

    clickedvalues.forEach((item,index)=>{
        text+="No. of "+index+"s are : "+item+" \n";
    });
    
    console.log(text);
//var str = 'first line \nsecond line...';
var a = 600;
var b = 400;
var lineheight = 100;
var lines = text.split('\n');

var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
gradient.addColorStop("0"," magenta");
gradient.addColorStop("0.5", "blue");
gradient.addColorStop("1.0", "red");
// Fill with gradient
ctx.fillStyle = gradient;


for (var j = 0; j<lines.length; j++)
ctx.fillText(lines[j], a, b + (j*lineheight) );

}
*/


//start of endcall
function endcall(){

    var scoreofplayer=0;
    var scoresforsteps=[1,2,3,3,5,10];
    var strt="xyx";
    var anstext="";
    var indexesforclickedvalues=["idle","block","forward","backward","kick","punch"];   
    for(var k=0;k<indexesforclickedvalues.length;k++)
    {  console.log("No. of "+indexesforclickedvalues[k]+"s are : "+clickedvalues[indexesforclickedvalues[k]]+" \n");
      //strt+=strt;
      anstext += "Score for "+ indexesforclickedvalues[k].toString() +"s are : "+ clickedvalues[indexesforclickedvalues[k]].toString() +"*"
      +scoresforsteps[k].toString()+"\n";
      //console.log(strt);
      scoreofplayer+=scoresforsteps[k]*clickedvalues[indexesforclickedvalues[k]];
    }
    //console.log("My final text");
    //console.log(anstext);


//console.log("this is my end call");
//var str = 'first line \nsecond line...';
var a = 100;
var b = 200;
var lineheight = 100;
var lines = anstext.split('\n');

var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
gradient.addColorStop("0"," magenta");
gradient.addColorStop("0.5", "blue");
gradient.addColorStop("1.0", "red");
// Fill with gradient
ctx.fillStyle = gradient;
ctx.font="90px Arial";


for (var j = 0; j<lines.length; j++)
ctx.fillText(lines[j], a, b + (j*lineheight) );

document.getElementById("score").innerHTML =  "<h1> Your Score is :"+ scoreofplayer.toString() +"</h1>";
};
//end of endcall


//all we changing in this is that we initially select one position and instead of looping
//we using recursion to get repeated if no other buttons are clicked
loadAllImages((images) => { 
    //let selectedPosition="idle"; instead we can use a queue
    var queueofselectedList =[];

    //recursion defination
    let aux = () => {
        let selectedPosition;
        if(queueofselectedList.length === 0){
            selectedPosition="idle";
        }else{
            selectedPosition=queueofselectedList.shift();
        }

        ////adding to stop recursion
        if(selectedPosition!=="end"){
            clickedvalues[selectedPosition]++;
            animate(ctx,images,selectedPosition,aux);
        }else{
            //actual ends 
            console.log(clickedvalues);

            ctx.clearRect(0,0,1440,900);
           

            endcall();
            
            console.log("Game stopped");
        }     

    };
    //recursion calling
    aux();
    //animate(ctx,images,"punch",()=>{console.log("This is my name")});
               
    document.getElementById('punch').onclick = ()=>{
       queueofselectedList.push("punch");
    };
    document.getElementById('kick').onclick = ()=>{
       queueofselectedList.push("kick");
    };
    //new features            
    document.getElementById('backward').onclick = ()=>{
        if(positionxofimg>=20)positionxofimg=positionxofimg-20;
        queueofselectedList.push("backward");
    };
    document.getElementById('block').onclick = ()=>{
        queueofselectedList.push("block");
    };
    document.getElementById('forward').onclick = ()=>{
        if(positionxofimg<=850)positionxofimg=positionxofimg+20;
        queueofselectedList.push("forward");
    };
    document.getElementById('end').onclick = ()=>{
        queueofselectedList.push("end");
    };

    document.addEventListener("keyup",(event)=>{
        const key=event.key; // "ArrowDown" "ArrowLeft" "ArrowRight" "ArrowUp"
        if(key === "ArrowLeft"){
            queueofselectedList.push("kick");
        }else if(key === "ArrowRight"){
            queueofselectedList.push("punch");
        }else if(key === "ArrowDown"){

            if(positionxofimg>=20)positionxofimg=positionxofimg-20;
            queueofselectedList.push("backward");

        }else if(key === "ArrowUp"){

            if(positionxofimg<=850)positionxofimg=positionxofimg+20;
            queueofselectedList.push("forward");

        }else if(event.code === "Space"){
            queueofselectedList.push("block");
        }
    });

});



