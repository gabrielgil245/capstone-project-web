import './App.css';
import { Button, List, Collapse } from 'antd';
const { Panel } = Collapse;

function Results(props) {

  return (
  <>
    <div className={"col-span-full md:col-span-9 lg:col-span-10 p-4 md:pt-6"}>
      <ul>
        {/* Question Input Bar */}
        <div className={"grid grid-cols-12 gap-4"}>
          {props.selectedCategory && <input value={props.inputQuestionText} onChange={(event) => {
            props.setInputQuestionText(event.currentTarget.value);
            }} type="text" className={'col-span-full md:col-span-9 lg:col-span-10 border rounded w-full border p-1'}/>}
          {props.selectedCategory && <Button type={'primary'} className={'col-start-4 col-span-6 md:col-span-3 lg:col-span-2 cursor-pointer'} onClick={props.createNewQuestion}>New Question</Button>}
        </div>
        <br/>            
        
        {/* Responses w/ Answers & Input Bar */}             
        {props.selectedCategory && <Collapse onChange={props.callback} accordion>
          {props.questions && props.questions.map((question, index) => {
            return <Panel key={question.id} header={<div className={"grid grid-cols-12 gap-2"}>
              <div className={"col-span-8 md:col-span-10 xl:col-span-11"}>
                <span>{question.questionText}</span>
                {question.Answers.length > 0 && <span> 
                  &nbsp;- Number of Answers: {question.Answers.length}
                </span>}
              </div>
              {props.userId == question.userId && <span className={"col-span-4 md:col-span-2 xl:col-span-1"}>
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
                  }} type="text" className={'border rounded p-1 col-span-full md:col-span-9 lg:col-span-10'}/>
                <Button type={'primary'} className={"col-start-4 col-span-6 md:col-span-3 lg:col-span-2 cursor-pointer"}
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
        
        {!props.selectedCategory && <h1 className={'text-center text-xl uppercase tracking-wider text-blue-500'}>Select a subject to get started</h1>}

      </ul>
    </div>
  </>
  );
}

export default Results;
