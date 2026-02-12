import React, { useState } from 'react';

interface LoginFormProps {
  onLogin?: (employeeCode: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [employeeCode, setEmployeeCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(employeeCode);
    }
    console.log('Employee code:', employeeCode);
  };

  return (
    <div className="rounded-2xl p-6 md:p-8 shadow-lg max-w-md formbg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="employeeCode" 
            className="block text-lg font-medium text-gray-800 mb-2 text-left"
          >
            Employee code
          </label>
          <input
            type="text"
            className="w-full border-none rounded-xl py-2 px-4 text-lg bg-white focus:outline-none focus:shadow-lg focus:shadow-primary/30 transition-shadow"
            id="employeeCode"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            placeholder=""
          />
        </div>
        <div className="text-center">
          <button 
            type="submit" 
            className="prplbtn1 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
