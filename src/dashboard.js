import './App.css';
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Results from "./results";
import React, {useState, useEffect} from 'react';
import { notification } from 'antd';

function Dashboard() {

  // https://boiling-waters-15789.herokuapp.com/
  
  let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [inputQuestionText, setInputQuestionText] = useState('');
  const [inputAnswerText, setInputAnswerText] = useState('');
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [filter, setFilter] = useState(false);

  const fetchCategories = async () => {
    let res = await fetch(`${apiUrl}/api/v1/categories?token=${localStorage.getItem('token')}`);
    let data = await res.json();
    console.log(data);
    setCategories(data);
  }
  
  const fetchUserId = async () => {
    let res = await fetch(`${apiUrl}/api/v1/users/me?token=${localStorage.getItem('token')}`);
    let user = await res.json();
    console.log("The current user is",user.userId);
    setUserId(user.userId)
  }

  const fetchQuestions = async () => {
    console.log(selectedCategory);
    if(selectedCategory){
      let res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions?token=${token}`);
      let data = await res.json();
      console.log(data);
      setQuestions(data.reverse());
      setFilter(false);
    }
    
  }

  const filterUserQuestions = async () => {
    if(!filter){
      let res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions?token=${token}&userId=${userId}`);
      let data = await res.json();
      console.log(data);
      setQuestions(data.reverse());
      setFilter(true);
    } else {
      fetchQuestions();
    }
    
  }

  const fetchAnswers = async (questionId) => {
    console.log(questionId);
    if(questionId){
      let res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${questionId}/answers?token=${token}`);
      let data = await res.json();
      console.log(data);
      setAnswers(data.reverse());
    } 
    
  }

  const createNewQuestion = async () => {
    console.log(selectedCategory);
    if(inputQuestionText === ''){
      console.log("Type in a question first!");
    }

    if(selectedCategory && inputQuestionText !== ''){
      let questionBody = { 
        questionText: inputQuestionText,
        userId: userId
      }

      let options = {
        method: 'POST',
        body: JSON.stringify(questionBody),
        headers: {}
      };
      options.headers["Accept"] = "application/json, text/plain, */*";
      options.headers["Content-Type"] = "application/json;charset=utf-8";
      console.log(options);
      
      const res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions?token=${token}`, options);
      let data = await res.json();
      console.log(data);
      fetchQuestions();
      setInputQuestionText('');
      notification['success']({
        message:'Thank you',
        description:
        `Your question was successfully posted!`,
      })

    }
    
  }

  const createNewAnswer = async (questionId) => {
    console.log(selectedQuestion);
    if(inputAnswerText == ''){
      console.log("Type in an answer first!");
    }

    if(questionId && inputAnswerText !== ''){
      let answerBody = { answerText: inputAnswerText }

      let options = {
        method: 'POST',
        body: JSON.stringify(answerBody),
        headers: {}
      };
      options.headers["Accept"] = "application/json, text/plain, */*";
      options.headers["Content-Type"] = "application/json;charset=utf-8";
      console.log(options);

      const res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${questionId}/answers?token=${token}`, options);
      let data = await res.json();
      console.log(data);
      fetchAnswers(questionId);
      fetchQuestions();
      setInputAnswerText('');
      notification['success']({
        message:'Thank you',
        description:
        `Your answer was successfully posted!`,
      })
    
    }
  }

  const deleteSelectedQuestion = async (questionId) => {
    console.log(selectedCategory);
    console.log(questionId);
    await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${questionId}?token=${token}&userId=${userId}`, 
    {method: 'DELETE'});
    fetchQuestions();
    notification['success']({
      message:'Deleted',
      description:
      `Your question was successfully deleted!`,
    })
  }

  const isLoggedIn = () => {
    if(localStorage.getItem('token')){
      setToken(localStorage.getItem('token'));
      return true;
    } else{
      return false;
    }
  }

  const logOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  function callback(questionId) {
    console.log(questionId);
    fetchAnswers(questionId);
  }

  useEffect(() => {
    if(isLoggedIn()){
      fetchUserId();
      fetchCategories();
    } else{
      window.location.href = '/'
    }
    
    
  }, [])

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory])

  useEffect(() => {
    fetchAnswers();
  }, [selectedQuestion])

  // Empty square brackets leads to running once on load
  // If someStateVariable changes, this function will load
  // Use effect may be dependent for multiple variables  
  
  return (
    <>
      {token && <div>
        <Navbar logOut={logOut}/>

        <div className={"grid grid-cols-12"}>

          <Sidebar categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedQuestion={setSelectedQuestion}
          filterUserQuestions={filterUserQuestions}/>
          
          <Results selectedCategory={selectedCategory}
          inputQuestionText={inputQuestionText}
          setInputQuestionText={setInputQuestionText}
          createNewQuestion={createNewQuestion}
          callback={callback}
          questions={questions}
          userId={userId}
          deleteSelectedQuestion={deleteSelectedQuestion}
          inputAnswerText={inputAnswerText}
          setInputAnswerText={setInputAnswerText}
          createNewAnswer={createNewAnswer}
          answers={answers}/>

        </div>
      </div>}
    </>
  );
}

export default Dashboard;
