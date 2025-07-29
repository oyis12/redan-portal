import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaList, FaCreditCard, FaBox, FaBell, FaMoneyCheckAlt } from 'react-icons/fa';
import logo from '../../assets/images/icons/logo_small.png';
import link from '../../assets/images/icons/link.png';

const Navbar = () => {
  return (
    <div className="h-screen bg-white text-black flex flex-col rounded-tr-xl rounded-br-xl">
      <div className="p-4 text-xl font-bold flex items-center">
        <img src={logo} alt="" className='w-6 mx-2'/>
        <h2 className='text-[1rem]'>Cutlist</h2>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col p-4 space-y-2">
          <li>
            <Link 
              to="dashboard" 
              className="p-2 rounded hover:bg-[#F2C94C] font-semibold flex items-center"
            >
              <FaTachometerAlt className="mr-2"/> Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="users" 
              className="p-2 rounded hover:bg-[#F2C94C] font-semibold flex items-center"
            >
              <FaUsers className="mr-2"/> Users
            </Link>
          </li>
          <li>
            <Link 
              to="cutlist" 
              className="p-2 rounded hover:bg-[#F2C94C] font-semibold flex items-center"
            >
              <FaList className="mr-2"/> Cutlist
            </Link>
          </li>
          <li>
            <Link 
              to="credit" 
              className="p-2 rounded hover:bg-[#F2C94C] font-semibold flex items-center"
            >
              <FaCreditCard className="mr-2"/> Credit
            </Link>
          </li>
          <li>
            <Link 
              to="package" 
              className="p-2 rounded hover:bg-[#F2C94C] font-semibold flex items-center"
            >
              <FaBox className="mr-2"/> Package
            </Link>
          </li>
          <li>
            <Link 
              to="notification" 
              className="p-2 rounded hover:bg-[#F2C94C] font-semibold flex items-center"
            >
              <FaBell className="mr-2"/> Notification
            </Link>
          </li>
          <li>
            <Link 
              to="/payments" 
              className="p-2 rounded hover:bg-[#F2C94C] font-semibold flex items-center"
            >
              <FaMoneyCheckAlt className="mr-2"/> Payments
            </Link>
          </li>
        </ul>
      </nav>

      <div className='flex justify-center items-center flex-col relative bottom-11'>
        <div className='rounded-full w-11 h-11 bg-slate-800'></div>
        <p className='mt-3 font-semibold text-sm'>Paul Yonder</p>
        <span className='text-[.8rem] -mt-1'>Admin</span>

        <button className='flex items-center mt-10 text-sm font-semibold'>
          <img src={link} alt='' className='w-4 mr-2'/> Log Out
        </button>
      </div>
    </div>
  );
}

export default Navbar;
