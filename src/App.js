import './App.css';
import React, {useState, useEffect} from 'react';


function App() {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [inputText, setInputText] = useState('');

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

  const createNewQuestion = async () => {
    console.log(selectedCategory);
    if(selectedCategory){
      
      let questionBody = { questionText: inputText }

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
      setInputText('');
      alert("Question successfully created!");
    }
    
  }

  useEffect(() => {
    fetchCategories();
  }, [])

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory])

  // Empty square brackets leads to running once on load
  // If someStateVariable changes, this function will load
  // Use effect may be dependent for multiple variables
  
  return (
    <>
      {/* Navbar */}
      <div className={"grid grid-cols-12"}>
        <div className={"col-span-full border p-4"}>
          <h1 className={'text-center text-3xl'}>
            App Title
          </h1>
        </div>
      </div>
      {/* Sidebar */}
      <div className={"grid grid-cols-12"}>
        <div className={"col-span-full md:col-span-3 lg:col-span-2 border p-4"}>
          <ul>
            {categories.map((category, index) => {
              return <li key={index} className={category.id == selectedCategory ? 
                "border p-4 cursor-pointer bg-gray-300" : "border p-4 cursor-pointer"} 
                onClick={() => {
                setSelectedCategory(category.id);
                }}>
                {category.name}
              </li>
            })}
          </ul>
        </div>
        {/* Forum */}

        <div className={"col-span-full md:col-span-9 lg:col-span-10 border p-4"}>
          <ul>
            <div className={"grid grid-cols-12 gap-4"}>
              {selectedCategory && <input value={inputText} onChange={(event) => {
                setInputText(event.currentTarget.value);
                }} type="text" className={'col-span-full md:col-span-9 lg:col-span-10 border w-full rounded border-gray-300 p-2'}/>}
                {selectedCategory && <span className={'col-span-full md:col-span-3 lg:col-span-2 bg-green-600 cursor-pointer rounded text-center text-white text-xl md:text-lg p-2'} onClick={createNewQuestion}>New Question</span>}
            </div>
            <br/>
            {questions.map((question, index) => {
              return <li key={index} className={question.id == selectedQuestion ? 
                "border p-4 cursor-pointer bg-blue-300" : "border p-4 cursor-pointer"} 
                onClick={() => {
                setSelectedQuestion(question.id);
                }}>
                  {question.questionText}
                  {question.Answers.length > 0 && <span> - Number of Answers: {question.Answers.length}</span>}
              </li>
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
