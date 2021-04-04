import './App.css';
import { Button } from 'antd';

function Navbar(props) {

  return (
  <>
    <div className={"grid grid-cols-12 place-items-center border"}>
      <div className={"col-span-9 p-4"}>
        <h1 className={'text-center text-3xl'}>
          Forum App
          </h1>
      </div>
      <div className={"col-span-3 text-xl md:text-lg"}>
        <Button type={'danger'} className={"cursor-pointer"} onClick={props.logOut}>Log Out</Button>
      </div>
    </div>
  </>
  );
}

export default Navbar;
