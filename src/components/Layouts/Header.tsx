import Image from 'next/image';
import Link from "next/link";
import SelectField from '../Form/SelectFields';
import { APP_URL } from '@/src/config/constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
interface User {
  name: string;    
  picture?: string;
  role?: string[];
  roleCode?: string;
  createdBy?: string;
  updatedBy?: string;
}



const Header = ({ setResponsiveSidebar }: any) => {
  const router = useRouter();
  // const isMenuOpen = useSelector((state: any) => state.menu.isOpen);
  const [logoutConfirm, setLogoutConfirm] = useState<boolean>(false)
  const [dropdownValue, setDropdownValue] = useState<string>("");

  
  return (
    <>
      <header className="admin-header">
        <div className="admin-header_ls">
          <button
            className="admin-sidebar_arrowIcon"
            style={{ right: 'unset' }}
          >
           
          </button>
        </div>
        <div className="admin-header_rs">
          <div className="admin-header_icons mx-3">
            <Link href="https://drive.google.com/drive/folders/1Xe__8IibKJr2h_aaYmGCoVRVhz5q9xza?usp=sharing" 
            target="_blank" className="adminAction__title">
              <span className="icon">
                <img
                  src="/images/svg/icons/Link.svg"
                  style={{top: '5px',right: '5px', width: '15px',height: '15px', background: 'orange' }}
                />
              </span>
              {' '} User Manuals
            </Link>
          </div>
          <div className="admin-header_icons mx-3">
            <Link href="https://ithelpdesk.jspl.com/ItSupport/jspl/auth/login" 
            target="_blank" className="adminAction__title">
              <span className="icon">
                <img
                  src="/images/svg/icons/Edit.svg"
                  style={{top: '5px',right: '5px', width: '15px',height: '15px', background: 'orange' }}
                />
              </span>
              {' '} HelpDesk
            </Link>
          </div>
           <div className="admin-header_icons mx-3">
            <Link href={APP_URL.MY_ACTION} className="adminAction__title">
              <span className="icon">
                <img
                  src="/images/svg/icons/play.svg"
                  style={{top: '5px',right: '5px', width: '15px',height: '15px' }}
                />
              </span>
              {' '} My Actions
            </Link>
          </div>
            <div className="admin-header_icons mx-3">
            <Link href={APP_URL.REPORT_DASHBOARD} className="adminAction__title">
              <span className="icon">
                <img
                  src="/images/svg/icons/Form.svg"
                  style={{top: '5px',right: '5px', width: '15px',height: '15px', background: 'orange'}}
                />
              </span>
              {' '} Reports
            </Link>
          </div>
          <div className="admin-header_rs--role">
            {/* <select className='option'>
              <option className='option__value'>Change Role</option>
            </select> */}
           
           
          </div>
          {/* <div className="admin-header_icons-item d-lg-none ms-2">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
              </svg>
            </span>
          </div> */}
          <div className="admin-header_rs--user ms-2 ms-lg-3">
            <Image
              width="30"
              height="30"
              src="/images/svg/userIcon.svg"
              alt="user icon"
              style={{borderRadius: "50%"}}
              className='img-fluid u-image'
            />
            <select 
              value={dropdownValue} 
              className='user-option' 
              name="role" 
              onChange={(e) => {
                setDropdownValue(e.target.value);
                if (e.target.value === "logout") {
                  setLogoutConfirm(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && dropdownValue === "logout") {
                  setLogoutConfirm(true);
                  e.preventDefault();
                }
              }}
            >
              <option className='user-option__value' value="logout">Logout</option>
            </select>
          </div>
        </div>
        {/* <UserHeaderInfo user={user} setLogoutConfirm={setLogoutConfirm} /> */}
      </header>
    
    </>
  );
};
export default Header;