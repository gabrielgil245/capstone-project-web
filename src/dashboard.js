import './App.css';
import React, {useState, useEffect} from 'react';
import { Button, List, Collapse, notification } from 'antd';
const { Panel } = Collapse;

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
        {/* Navbar */}
        <div className={"grid grid-cols-12 place-items-center border"}>
          <div className={"col-span-9 p-4"}>
            <h1 className={'text-center text-3xl'}>
              Forum App
            </h1>
          </div>
          <div className={"col-span-3 text-xl md:text-lg"}>
            <Button type={'danger'} className={"cursor-pointer"} onClick={logOut}>Log Out</Button>
          </div>
        </div>

        {/* Dashboard */}
        <div className={"grid grid-cols-12"}>

          {/* Sidebar */}
          <div className={"col-span-full md:col-span-3 lg:col-span-2 border p-4"}>
            <ul>
              {categories.map((category, index) => {
                return <li key={index} className={category.id == selectedCategory ? 
                  "rounded border my-2 p-2 cursor-pointer bg-blue-500 text-white text-center font-bold" : 
                  "rounded border my-2 p-2 cursor-pointer text-center"} 
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedQuestion('');
                  }}>
                  {category.name}
                </li>                
              })}
              {selectedCategory && <li className={'rounded border my-2 p-2 cursor-pointer bg-gray-500 text-white text-center font-bold'} onClick={filterUserQuestions}>Filter</li>}
            </ul>
          </div>
          
          {/* Results */}
          <div className={"col-span-full md:col-span-9 lg:col-span-10 border p-4"}>
            <ul>
              <div className={"grid grid-cols-12 gap-4"}>
                
                {/* Question Input Bar */}
                {selectedCategory && <input value={inputQuestionText} onChange={(event) => {
                  setInputQuestionText(event.currentTarget.value);
                  }} type="text" className={'col-span-full md:col-span-9 lg:col-span-10 border rounded w-full border p-1'}/>}
                  {selectedCategory && <Button type={'primary'} className={'col-span-full md:col-span-3 lg:col-span-2 cursor-pointer text-xl md:text-lg'} onClick={createNewQuestion}>New Question</Button>}
              </div>
              <br/>            
              
              {/* Responses w/ Answers & Input Bar */}             
              {selectedCategory && <Collapse onChange={callback} accordion>
                {questions && questions.map((question, index) => {
                  return <Panel key={question.id} header={<div className={"grid grid-cols-12 gap-4"}>
                    <div className={"col-span-10"}>
                      <span>{question.questionText}</span>
                      {question.Answers.length > 0 && <span className={"col-span-4"}> 
                        &nbsp;- Number of Answers: {question.Answers.length}
                      </span>}
                    </div>
                    {userId == question.userId && <span className={"col-span-2"}>
                      <Button type={"danger"} onClick={() => {deleteSelectedQuestion(question.id);}}>
                        Delete
                      </Button>
                    </span>}
                  </div>}>
                    <List
                    size="small"
                    header={<div className={'font-bold'}>Answers List</div>}
                    footer={<div className={"grid grid-cols-12 gap-4"}>
                      <input value={inputAnswerText} onChange={(event) => {
                        setInputAnswerText(event.currentTarget.value);
                        }} type="text" className={'border rounded p-1 col-span-9'}/>
                      <Button type={'primary'} className={"col-span-3 cursor-pointer"}
                        onClick={() => {createNewAnswer(question.id);}}>
                          Add Answer
                      </Button>
                    </div>}
                    bordered
                    dataSource={answers}
                    renderItem={answer => <List.Item>
                      <div>
                        {answer.answerText}
                      </div>

                    </List.Item>}
                    />
                  </Panel>})}

              </Collapse>}
              
              {!selectedCategory && <h1 className={'text-center text-2xl uppercase tracking-wider text-blue-500'}>Select a category to get started</h1>}
     
            </ul>
          </div>

        </div>
      </div>}
    </>
  );
}

export default Dashboard;
