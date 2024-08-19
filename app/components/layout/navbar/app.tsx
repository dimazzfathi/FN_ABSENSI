import { useState } from 'react';

const DropdownMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
      >
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
          <ul className="py-1">
            <li>
              <a
                href="../../administrator/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
            </li>
            <li>
              <a
                href="../../administrator/add_user"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Add User
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
            </li>
            <hr />
            <li>
              <a
                href="../../administrator/logout"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
