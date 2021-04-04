import './App.css';
import { Button, List, Collapse } from 'antd';
const { Panel } = Collapse;

function Results(props) {

  return (
  <>
    <div className={"col-span-full md:col-span-9 lg:col-span-10 border p-4"}>
      <ul>
        {/* Question Input Bar */}
        <div className={"grid grid-cols-12 gap-4"}>
          {props.selectedCategory && <input value={props.inputQuestionText} onChange={(event) => {
            props.setInputQuestionText(event.currentTarget.value);
            }} type="text" className={'col-span-full md:col-span-9 lg:col-span-10 border rounded w-full border p-1'}/>}
          {props.selectedCategory && <Button type={'primary'} className={'col-span-full md:col-span-3 lg:col-span-2 cursor-pointer text-xl md:text-lg'} onClick={props.createNewQuestion}>New Question</Button>}
        </div>
        <br/>            
        
        {/* Responses w/ Answers & Input Bar */}             
        {props.selectedCategory && <Collapse onChange={props.callback} accordion>
          {props.questions && props.questions.map((question, index) => {
            return <Panel key={question.id} header={<div className={"grid grid-cols-12 gap-4"}>
              <div className={"col-span-10"}>
                <span>{question.questionText}</span>
                {question.Answers.length > 0 && <span className={"col-span-4"}> 
                  &nbsp;- Number of Answers: {question.Answers.length}
                </span>}
              </div>
              {props.userId == question.userId && <span className={"col-span-2"}>
                <Button type={"danger"} onClick={() => {props.deleteSelectedQuestion(question.id);}}>
                  Delete
                </Button>
              </span>}
            </div>}>
              <List
              size="small"
              header={<div className={'font-bold'}>Answers List</div>}
              footer={<div className={"grid grid-cols-12 gap-4"}>
                <input value={props.inputAnswerText} onChange={(event) => {
                  props.setInputAnswerText(event.currentTarget.value);
                  }} type="text" className={'border rounded p-1 col-span-9'}/>
                <Button type={'primary'} className={"col-span-3 cursor-pointer"}
                  onClick={() => {props.createNewAnswer(question.id);}}>
                    Add Answer
                </Button>
              </div>}
              bordered
              dataSource={props.answers}
              renderItem={answer => <List.Item>
                <div>
                  {answer.answerText}
                </div>

              </List.Item>}
              />
            </Panel>})}

        </Collapse>}
        
        {!props.selectedCategory && <h1 className={'text-center text-2xl uppercase tracking-wider text-blue-500'}>Select a category to get started</h1>}

      </ul>
    </div>
  </>
  );
}

export default Results;
