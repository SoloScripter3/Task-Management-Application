import React from "react";

const Button = ({ btnName }) => {
  return (
    <div>
      <button className="px-8 py-2 bg-purple-400 text-white rounded hover:bg-purple-700 hover:text-green-950 transition-colors duration-300 cursor-pointer">
        {btnName}
      </button>
    </div>
  );
};

export default Button;
