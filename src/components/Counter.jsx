import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const handleIncrementChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setIncrement(value);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-md w-64">
      <h2 className="text-2xl font-bold mb-4 text-pokeball">PokéCounter</h2>
      <p className="text-3xl font-semibold text-pokeball mb-4">{count}</p>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setCount(Math.max(0, count - increment))}
          className="px-4 py-2 bg-pokeball text-white rounded-md hover:bg-pokeball-hover"
        >
          -
        </button>
        <button
          onClick={() => setCount(count + increment)}
          className="px-4 py-2 bg-pokeball text-white rounded-md hover:bg-pokeball-hover"
        >
          +
        </button>
      </div>
      <div className="flex items-center mb-4">
        <label htmlFor="increment" className="text-sm mr-2">
          Increment:
        </label>
        <input
          id="increment"
          type="number"
          min="1"
          value={increment}
          onChange={handleIncrementChange}
          className="w-16 p-1 border border-gray-300 rounded-md text-center"
        />
      </div>
      <button
        onClick={() => {
          setCount(0);
          setIncrement(1);
        }}
        className="px-6 py-2 bg-pokeball text-white rounded-md hover:bg-pokeball-hover"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;
