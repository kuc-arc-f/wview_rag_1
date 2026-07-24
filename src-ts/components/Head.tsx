//import { Routes, Route, Link } from 'react-router-dom';
import {Link } from 'react-router-dom';
import React, { useState , useEffect } from 'react';

function Page() {
  return (
  <div>
    <Link to="/" className="font-bold ms-4" >Home</Link>
    <Link to="/history" className="ms-4" >History</Link>
    <hr className="my-2" />
  </div>
  );
}
export default Page;
