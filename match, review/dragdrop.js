let dragged;

document.addEventListener("dragstart",function(e){
if(e.target.classList.contains("phrase")){
dragged=e.target;
}
});

document.addEventListener("dragover",function(e){
e.preventDefault();
});

document.addEventListener("drop",function(e){

if(e.target.classList.contains("drop-box")){
e.target.appendChild(dragged);
}

});


function checkAnswers(){

let correct=0;

document.querySelectorAll(".drop-box").forEach(box=>{

box.classList.remove("correct","wrong");

let phrase=box.querySelector(".phrase");

if(phrase){

if(phrase.dataset.answer===box.dataset.id){

box.classList.add("correct");
correct++;

}else{

box.classList.add("wrong");

}

}

});

document.getElementById("resultText").innerText="Score: "+correct+" / 12";

}


function toggleArabic(){

document.querySelectorAll(".ar").forEach(ar=>{

if(ar.style.display==="block"){
ar.style.display="none";
}else{
ar.style.display="block";
}

});

}


/* shuffle words */

document.addEventListener("DOMContentLoaded", shuffleWords);

function shuffleWords(){

let bank=document.querySelector(".phrase-bank");

let words=Array.from(bank.children);

for(let i=words.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1));

[words[i],words[j]]=[words[j],words[i]];

}

words.forEach(word=>bank.appendChild(word));

}