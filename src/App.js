import './App.css';
import React, {useState, useEffect} from 'react';


function App() {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  const fetchCategories = async () => {
    console.log("This function will fetch the categories");
    let res = await fetch('http://localhost:3000/api/v1/categories');
    let data = await res.json();
    console.log(data);
    setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, [])

  useEffect(() => {
    // fetchQuestions() - // TODO - Fetch and show the questions
  }, [selectedCategory])

  // Empty square brackets leads to running once on load
  // If someStateVariable changes, this function will load
  // Use effect may be dependent for multiple variables
  
  return (
    <>
      <div className={"grid grid-cols-12"}>
        <div className={"col-span-full border p-4"}>
          <h1 className={'text-center text-3xl'}>
            App Title
          </h1>
        </div>
      </div>
        
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
            
        <div className={"col-span-full md:col-span-9 lg:col-span-10 border p-4"}>
          <h1>
            Questions List
          </h1>
        </div>
      </div>
    </>
  );
}

export default App;
