import React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {axe} from 'jest-axe';

import Sectors from './Sectors';

const mockColors = [
  {red: '124', green: '234', blue: '12'},
  {red: '24', green: '134', blue: '112'},
];

const mockHandleClick = jest.fn();
const mockHandleKeyDown = jest.fn();

let container, getByRole;
beforeEach(() => {
  return ({container, getByRole} = render(
    <svg>
      <Sectors
        colors={mockColors}
        handleClick={mockHandleClick}
        handleKeyDown={mockHandleKeyDown}
        hueName={'red'}
        startAngle={30}
      />
    </svg>,
  ));
});

afterEach(() => {
  jest.clearAllMocks();
});

test('calls handleClick() when clicked', () => {
  userEvent.click(getByRole('button'));
  expect(mockHandleClick).toHaveBeenCalledTimes(1);
});

test('calls handleKeyDown() when Enter key is pressed', () => {
  getByRole('button').focus();
  userEvent.type(getByRole('button'), '{enter}', {skipClick: true});
  expect(mockHandleKeyDown).toHaveBeenCalledTimes(1);
});

test('calls handleKeyDown() when Space key is pressed', () => {
  getByRole('button').focus();
  userEvent.type(getByRole('button'), ' ', {skipClick: true});
  expect(mockHandleKeyDown).toHaveBeenCalledTimes(1);
});

test('renders correctly', () => {
  expect(container).toMatchInlineSnapshot(`
    <div>
      <svg>
        <g
          style="opacity: 1;"
          transform="rotate(-30, 250, 250)"
        >
          <g>
            <path
              d="M250,250 l250,0 A250,250 0,0,0 491.4814565722671,185.29523872436982 z"
              data-testid="sector"
              fill="rgb(124, 234, 12)"
              stroke="none"
              transform="rotate(-0, 250, 250)"
            />
            <path
              d="M250,250 l250,0 A250,250 0,0,0 491.4814565722671,185.29523872436982 z"
              data-testid="sector"
              fill="rgb(24, 134, 112)"
              stroke="none"
              transform="rotate(-15, 250, 250)"
            />
          </g>
          <g
            aria-disabled="false"
            aria-label="Show color code of equiluminant colors in red hue"
            role="button"
            tabindex="0"
          >
            <path
              d="M250,250 l250,0 A250,250 0,0,0 466.5063509461097,125.00000000000001 z"
              data-testid="sector"
              fill="transparent"
              stroke="rgb(44, 44, 44)"
              transform="rotate(-0, 250, 250)"
            />
          </g>
        </g>
      </svg>
    </div>
  `);
});

test('is accessible', async () => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  cleanup();
});