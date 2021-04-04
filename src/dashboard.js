import './App.css';
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

  const fetchCategories = async () => {
    let res = await fetch(`${apiUrl}/api/v1/categories?token=${localStorage.getItem('token')}`);
    let data = await res.json();
    console.log(data);
    setCategories(data);
  }

  const fetchQuestions = async () => {
    console.log(selectedCategory);
    if(selectedCategory){
      let res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions?token=${token}`);
      let data = await res.json();
      console.log(data);
      setQuestions(data.reverse());
    }
    
  }

  const fetchAnswers = async () => {
    console.log(selectedQuestion);
    if(selectedQuestion){
      let res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${selectedQuestion}/answers?token=${token}`);
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
      let questionBody = { questionText: inputQuestionText }

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

  const createNewAnswer = async () => {
    console.log(selectedQuestion);
    if(inputAnswerText == ''){
      console.log("Type in an answer first!");
    }

    if(selectedQuestion && inputAnswerText !== ''){
      let answerBody = { answerText: inputAnswerText }

      let options = {
        method: 'POST',
        body: JSON.stringify(answerBody),
        headers: {}
      };
      options.headers["Accept"] = "application/json, text/plain, */*";
      options.headers["Content-Type"] = "application/json;charset=utf-8";
      console.log(options);

      const res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${selectedQuestion}/answers?token=${token}`, options);
      let data = await res.json();
      console.log(data);
      fetchAnswers();
      fetchQuestions();
      setInputAnswerText('');
      notification['success']({
        message:'Thank you',
        description:
        `Your answer was successfully posted!`,
      })
    
    }
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

  useEffect(() => {
    if(isLoggedIn()){
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
        {/* Navbar */}
        <div className={"grid grid-cols-12 place-items-center border"}>
          <div className={"col-span-9 p-4"}>
            <h1 className={'text-center text-3xl'}>
              Forum App
            </h1>
          </div>
          <div className={"col-span-3 bg-red-600 hover:bg-red-800 cursor-pointer rounded text-center text-white text-xl md:text-lg p-3"}>
            <button onClick={logOut}>Log Out</button>
          </div>
        </div>

        {/* Dashboard */}
        <div className={"grid grid-cols-12"}>

          {/* Sidebar */}
          <div className={"col-span-full md:col-span-3 lg:col-span-2 border p-4"}>
            <ul>
              {categories.map((category, index) => {
                return <li key={index} className={category.id == selectedCategory ? 
                  "rounded border my-2 p-4 cursor-pointer bg-blue-500 text-white font-bold" : "rounded border my-2 p-4 cursor-pointer"} 
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedQuestion('');
                  }}>
                  {category.name}
                </li>
              })}
            </ul>
          </div>
          
          {/* Results */}
          <div className={"col-span-full md:col-span-9 lg:col-span-10 border p-4"}>
            <ul>
              <div className={"grid grid-cols-12 gap-4"}>
                
                {/* Question Input Bar */}
                {selectedCategory && <input value={inputQuestionText} onChange={(event) => {
                  setInputQuestionText(event.currentTarget.value);
                  }} type="text" className={'col-span-full md:col-span-9 lg:col-span-10 border w-full rounded border-gray-300 p-2'}/>}
                  {selectedCategory && <span className={'col-span-full md:col-span-3 lg:col-span-2 bg-green-600 cursor-pointer rounded text-center text-white text-xl md:text-lg p-2'} onClick={createNewQuestion}>New Question</span>}
              </div>
              <br/>            
              
              {/* Responses & Answer Input Bar */}
              {questions.map((question, index) => {
                return <div>
                  <li key={index} className={question.id == selectedQuestion ? 
                  "border my-2 p-4 bg-gray-300 font-bold" : "border my-2 p-4 cursor-pointer"} 
                  onClick={() => {
                  setSelectedQuestion(question.id);
                  }}>
                    {question.questionText}
                    {question.Answers.length > 0 && <span> - Number of Answers: {question.Answers.length}</span>}
                                                        
                    {answers.map((answer, id) => {
                      return answer.questionId == question.id && <div key={id} className={"rounded border p-4 mt-4 bg-white font-normal"}>
                        {answer.answerText}
                      </div>
                    })}
                </li>
                {selectedQuestion == question.id && 
                <div className={"bg-gray-300 p-4 border"}>
                  <input value={inputAnswerText} onChange={(event) => {
                    setInputAnswerText(event.currentTarget.value);
                    }} type="text" className={'rounded border p-2 mr-5 w-3/4'}/>
                    <button className={"col-span-full md:col-span-3 lg:col-span-2 bg-green-600 cursor-pointer rounded text-center text-white text-xl md:text-lg p-2"} 
                    onClick={createNewAnswer}>Add Answer</button>
                  </div>}
                    
                </div>

              })}           

            </ul>
          </div>

        </div>
      </div>}
    </>
  );
}

export default Dashboard;
