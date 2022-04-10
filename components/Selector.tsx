import React from 'react';
import { cls } from '@libs/client/utils';
import { useState } from 'react';

interface SelectorProps {
  list: string[];
  setValue: Function;
}

const checkedBgColors = [
  'checked:bg-yellow-500',
  'checked:bg-indigo-500',
  'checked:bg-teal-500',
  'checked:bg-pink-500',
  'checked:bg-orange-500',
];
const borderColors = [
  'border-yellow-500',
  'border-indigo-500',
  'border-teal-500',
  'border-pink-500',
  'border-orange-500',
];
const ringColors = [
  'ring-yellow-500',
  'ring-indigo-500',
  'ring-teal-500',
  'ring-pink-500',
  'ring-orange-500',
];
export default function Selector({ list, setValue }: SelectorProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked = true;
    setValue(e.target.value);
  };

  return (
    <div className="flex flex-wrap justify-center space-x-3 px-10">
      {list.map((e, i) => (
        <div
          key={i}
          className="mb-3 flex items-center justify-center space-x-2 "
        >
          <input
            onChange={onChange}
            type="radio"
            name="radio"
            id={`radio-${i}`}
            value={e}
            defaultChecked={i === 0}
            className={cls({
              classNames: `h-3 w-3 cursor-pointer appearance-none rounded-full border
              ${borderColors[i % borderColors.length]}
               ${ringColors[i % ringColors.length]} ring-offset-2 transition
               ${checkedBgColors[i % checkedBgColors.length]} checked:ring-2`,
            })}
          />
          <label htmlFor={`radio-${i}`} className="cursor-pointer">
            {e}
          </label>
        </div>
      ))}
    </div>
  );
}
