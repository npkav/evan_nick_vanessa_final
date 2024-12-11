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
    <div className="w-full max-w-4xl p-6 my-8 bg-[#f0f0f0] rounded-lg border-2 border-[#222224] relative">
      <h2 className="text-3xl font-bold mb-4">PokéCounter</h2>
      <p className="text-4xl font-semibold mb-6">{count}</p>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setCount(Math.max(0, count - increment))}
          disabled={count === 0}
          className="px-4 py-2 bg-[#ee1515] text-white rounded-lg disabled:opacity-0 w-[120px] opacity-40 hover:opacity-100 transition-all duration-300 active:scale-95 transform"
        >
          -
        </button>
        <button
          onClick={() => setCount(count + increment)}
          className="px-4 py-2 bg-[#ee1515] text-white rounded-lg disabled:opacity-0 w-[120px] opacity-40 hover:opacity-100 transition-all duration-300 active:scale-95 transform"
        >
          +
        </button>
      </div>
      <div className="flex items-center mb-6">
        <label htmlFor="increment" className="text-lg mr-4">
          Increment:
        </label>
        <input
          id="increment"
          type="number"
          min="1"
          value={increment}
          onChange={handleIncrementChange}
          className="w-24 p-2 border rounded-lg text-center"
        />
      </div>
      <button
        onClick={() => {
          setCount(0);
          setIncrement(1);
        }}
        className="px-4 py-2 bg-[#ee1515] text-white rounded-lg disabled:opacity-0 w-[120px] opacity-40 hover:opacity-100 transition-all duration-300 active:scale-95 transform"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;
