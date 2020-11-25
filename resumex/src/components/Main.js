import React, { useState } from "react";
import "./Main.css";
import useKeyWords from "../Hooks/KeyWords";
import useSoftSkills from "../Hooks/SoftSkills";
import pairMatch from "../Helpers/pairMatch";
import getScores from "../Helpers/getScores";
import compareText from "../Helpers/compareText"
import mammoth from "mammoth";
import DonutWithText from "../components/DonutWithText";
import BarChart from "../components/BarChart";
import document_logo from "../assets/img/document_logo.svg";
import Table from "../components/Table";
import { first } from "underscore";

export default function Main() {
const [input, setInput] = useState("");
const [input1, setInput1] = useState("");
const [edit, setEdit] = useState([""]);
const [edit1, setEdit1] = useState([""]);
const [edit2, setEdit2] = useState([""]);
const [edit3, setEdit3] = useState([""]);
const { keywords } = useKeyWords();
const { softskills } = useSoftSkills();

//vitalKeywords is an array with the same words of the database and jobposting
//for the vital keywords



const vitalKeywords = pairMatch(keywords, input)
const vitalSoftSkills = pairMatch(softskills, input);
console.log("vitalsoftskills:", vitalSoftSkills);

// 


//this a score of how many of the 
//vital keywords you have in your resume.
const firstScore = getScores(vitalKeywords,input1);
const secondScore = getScores(vitalSoftSkills, input1);

//resumeAndPosting is an array of the words 
//that repeat on the posting and repeat on the resume with a count of each

const resumeAndPosting = compareText(input1, input) 

console.log("resumeandposting is: ", resumeAndPosting);
// console.log("show database keywords: ", keywords, "vitalKeywords: ", vitalKeywords)
//printarray

console.log("FIRST SCORE:", firstScore);
console.log("SECOND SCORE", secondScore);

 
  //dummy for the barchart   
  const hardSkillScore = firstScore;   
  const softSkillScore =  secondScore;   
  const specificKeywords = 100;   
  const skillsSum = hardSkillScore + softSkillScore + specificKeywords;   
  const totalScore = 300;      
  //Dummy variables for charts      
  const match = (skillsSum/totalScore * 100).toFixed(2);   
  const unmatch = 100 - match;
  //Dummy variables for charts

const onChange = function(event){
  setInput(event.target.value);
}
const onChange1 = function(event){
  setInput1(event.target.value);
}


const onClick = function(event) {
  event.preventDefault();

  setEdit1(hardSkillScore);
  setEdit3(softSkillScore);

}

const wordTextResume = function(buffer) {
  //reads the file from resume and changes it to text

  mammoth.extractRawText({arrayBuffer: buffer})
  .then(function(result){
      const text = result.value; // The raw text
      const messages = result.messages;
      setInput1(text);
    })
  .done();
}

const onChangeResume = function(event){
  //takes the file and reads the file from buffer of array
  
  const reader = new FileReader();
  const fileData = event.target.files[0];
  reader.onloadend = (event) => {
  wordTextResume(event.target.result);
  }; //triggers when the reader stops reading file

   reader.readAsArrayBuffer(fileData);
}




  const wordTextJob = function (buffer) {
    //reads the file from job and changes it to text

    mammoth
      .extractRawText({ arrayBuffer: buffer })
      .then(function (result) {
        const text = result.value; // The raw text
        setInput(text);
      })
      .done();
  };

  const onChangeJob = function (event) {
    //takes the file and reads the file from buffer of array
    const reader = new FileReader();
    const fileData = event.target.files[0];
    reader.onloadend = (event) => {
      wordTextJob(event.target.result);
    }; //triggers when the reader stops reading file

    reader.readAsArrayBuffer(fileData);
  };

  return (
    <>
      <div class="whole-main">
        <section class="jumbotron text-center">
          

          <div class="container">
            <h1 class="jumbotron-heading">ResumeX : Tech Resume Expert</h1>
          </div>

          <div className="logo_container">
            <img src={document_logo}></img>
          </div>

        </section>
        <section className="input">
          <form id="main_form">
            <div class="job-area">
              <textarea className="textarea" name="job_description" placeholder="Paste Your Job Description Here" value={input} onChange={onChange}></textarea>
              <form class="job-upload">
              <input type="file" id="myFile" name="filename"onChange={onChangeJob}></input>
              </form>
            </div>
            <div class="resume-area">
              <textarea className="textarea" name="resume" placeholder="Paste Your Resume Here" value={input1} onChange={onChange1}></textarea>
              <form class="resume-upload">
              <input type="file" id="myFile" name="filename" onChange={onChangeResume}></input>
              </form>
            </div>
          </form>
        </section>


        <button
          type="submit"
          form="main_form"
          value="Submit"
          className="main_button"
          onClick={onClick}
        >
          Submit
        </button>
        {/* <h4>{edit}</h4> */}
        <h4>{vitalKeywords}</h4>
      </div>
      <h1 className="overview">Summary</h1>
      <div className="results_container">
        <DonutWithText match={match} unmatch={unmatch} />

        <div className="bars_container">
          <span>Primary Key Words</span>
          <BarChart score={edit1} />
          <span>Soft Skills Match</span>
          <BarChart score={edit3} />
          <span>Posting Specific Keywords Match</span>
          <BarChart score={specificKeywords} />
        </div>
      </div>
    </>
  );
}
