import './App.css';
import React, {useState, useEffect} from 'react';
import { List, Collapse } from 'antd';
const { Panel } = Collapse;

function App() {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [answers, setAnswers] = useState([]);
  const [inputQuestionText, setInputQuestionText] = useState('');
  const [inputAnswerText, setInputAnswerText] = useState('');

  const fetchCategories = async () => {
    let res = await fetch(`http://localhost:3000/api/v1/categories`);
    let data = await res.json();
    console.log(data);
    setCategories(data);
  }

  const fetchQuestions = async () => {
    console.log(selectedCategory);
    if(selectedCategory){
      let res = await fetch(`http://localhost:3000/api/v1/categories/${selectedCategory}/questions`);
      let data = await res.json();
      console.log(data);
      setQuestions(data);
    }
    
  }

  const fetchAnswers = async () => {
    console.log(selectedQuestion);
    if(selectedQuestion){
      let res = await fetch(`http://localhost:3000/api/v1/categories/${selectedCategory}/questions/${selectedQuestion}/answers`);
      let data = await res.json();
      console.log(data);
      setAnswers(data);
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
      
      const res = await fetch(`http://localhost:3000/api/v1/categories/${selectedCategory}/questions`, options);
      let data = await res.json();
      console.log(data);
      fetchQuestions();
      setInputQuestionText('');
      alert("Question successfully created!");
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

      const res = await fetch(`http://localhost:3000/api/v1/categories/${selectedCategory}/questions/${selectedQuestion}/answers`, options);
      let data = await res.json();
      console.log(data);
      fetchAnswers();
      fetchQuestions();
      setInputAnswerText('');
      alert("Answer successfully created!");
    
    }
  }

  useEffect(() => {
    fetchCategories();
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
      {/* Navbar */}
      <div className={"grid grid-cols-12"}>
        <div className={"col-span-full border p-4"}>
          <h1 className={'text-center text-3xl'}>
            Forum App
          </h1>
        </div>
      </div>

      {/* Dashboard */}
      <div className={"grid grid-cols-12"}>

        {/* Sidebar */}
        <div className={"col-span-full md:col-span-3 lg:col-span-2 border p-4"}>
          <ul>
            {categories.map((category, index) => {
              return <li key={index} className={category.id == selectedCategory ? 
                "border p-4 cursor-pointer bg-gray-300" : "border p-4 cursor-pointer"} 
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
                "border p-4 bg-gray-300" : "border p-4 cursor-pointer"} 
                onClick={() => {
                setSelectedQuestion(question.id);
                }}>
                  {question.questionText}
                  {question.Answers.length > 0 && <span> - Number of Answers: {question.Answers.length}</span>}
                                                      
                  {answers.map((answer, id) => {
                    return answer.questionId == question.id && <div key={id} className={"border p-4 mt-4 bg-white"}>
                      {answer.answerText}
                    </div>
                  })}
               </li>
               {selectedQuestion == question.id && 
               <div className={"bg-gray-300 p-4 border"}>
                 <input value={inputAnswerText} onChange={(event) => {
                   setInputAnswerText(event.currentTarget.value);
                   }} type="text" className={'border p-1 mr-5 w-3/4'}/>
                  <button className={"col-span-full md:col-span-3 lg:col-span-2 bg-green-600 cursor-pointer rounded text-center text-white text-xl md:text-lg p-2"} 
                  onClick={createNewAnswer}>Add Answer</button>
                </div>}
                   
              </div>

            })}

            {/* Antd Design Accordion Method */}
            {/* {selectedCategory && <Collapse accordion>
              {questions && questions.map((question, index) => {
                return <Panel header={question.questionText} key={index} onClick={(event) => {
                  setSelectedQuestion(event.currentTarget.value);
                }}
                >
                  <List
                    size="small"
                    header={<div className={'font-bold'}>Answers List</div>}
                    footer={<div>
                      <input value={inputAnswerText} onChange={(event) => {
                        setInputAnswerText(event.currentTarget.value);
                        }} type="text" className={'border p-1 mr-5 w-2/3'}/>
                        <button className={"col-span-full md:col-span-3 lg:col-span-2 bg-green-600 cursor-pointer rounded text-center text-white text-xl md:text-lg p-2"} 
                        onClick={() => {
                          createNewAnswer(selectedQuestion);
                        }}>Add Answer</button>
                      </div>}
                    bordered
                    dataSource={question.Answers}
                    renderItem={answer => <List.Item>
                      <div>
                        {answer.answerText}
                      </div>
                    </List.Item>}
                  />
                </Panel>
              })}
            </Collapse>} */}

          </ul>
        </div>

      </div>
    </>
  );
}

export default App;
