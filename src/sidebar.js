import './App.css';

function Sidebar(props) {

  return (
  <>
    <div className={"col-start-2 col-span-10 md:col-start-1 md:col-span-3 lg:col-span-2 p-4"}>
      <ul>
        {props.categories.map((category, index) => {
          return <li key={index} className={category.id == props.selectedCategory ? 
            "rounded border my-2 p-2 cursor-pointer bg-blue-500 hover:bg-blue-400 text-white text-center font-bold" : 
            "rounded border my-2 p-2 cursor-pointer text-center"} 
            onClick={() => {
              props.setSelectedCategory(category.id);
              props.setSelectedQuestion('');
            }}>
              {category.name}
            </li>                
          })}
          
        {props.selectedCategory && <li className={'rounded border my-2 p-2 cursor-pointer bg-gray-500 hover:bg-gray-400 text-white text-center font-bold'} onClick={props.filterUserQuestions}>
          Filter
        </li>}
      </ul>
    </div>
  </>
  );
}

export default Sidebar;
