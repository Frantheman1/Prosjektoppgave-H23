import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavBar} from './widgets';


class Noe extends  Component {

 render() {
  return (
   <>
   

    <div>Noe</div> 
   </>
    );


 

 
 }
}



let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <>
    <Noe />
    </>,
  );
