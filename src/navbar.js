import './App.css';
import { Button } from 'antd';

function Navbar(props) {

  return (
  <>
    <div className={"grid grid-cols-12 place-items-center border bg-blue-700"}>
      <div className={"col-span-8 md:col-span-9 lg:col-span-10 xl:col-span-8 p-2 mt-2"}>
        <h1 className={'text-center text-white text-2xl uppercase tracking-wider'}>
          Guide Me App
          </h1>
      </div>
      <div className={"col-span-4 md:col-span-3 lg:col-span-2 xl:col-start-11"}>
        <Button type={'danger'} className={"cursor-pointer"} onClick={props.logOut}>Log Out</Button>
      </div>
    </div>
  </>
  );
}

export default Navbar;
