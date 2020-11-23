import React from 'react';
import {act, cleanup, fireEvent, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {axe} from 'jest-axe';

import Swatch from '../../components/Swatch';
// import * as mockCopyToClipboard from '../../utils/copyToClipboard';

const mockColor = {
  red: 123,
  green: 133,
  blue: 23,
  rgbCode: 'rgb(123, 133, 23)',
};

// jest.mock('../../utils/copyToClipboard');

beforeAll(() => {
  jest.useFakeTimers(); // see https://jestjs.io/docs/en/timer-mocks
});

let container, getByRole;
beforeEach(() => {
  // mockCopyToClipboard.mockResolvedValueOnce();
  return ({container, getByRole} = render(
    <Swatch r={mockColor.red} g={mockColor.green} b={mockColor.blue} />,
  ));
});

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.useRealTimers();
});

test('temporarily (1.5 sec) changes the button label when clicked', async () => {
  const button = getByRole('button', {name: mockColor.rgbCode});
  userEvent.click(button);
  expect(button).toHaveTextContent('Copied!');
  act(() => jest.advanceTimersByTime(1500));
  // For jest.advanceTimersByTime(), see https://jestjs.io/docs/en/timer-mocks
  // For act(), see https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning?ck_subscriber_id=661694401#1-when-using-jestusefaketimers
  expect(button).toHaveTextContent(mockColor.rgbCode);
});

test('renders correctly', () => {
  expect(container).toMatchInlineSnapshot(`
    .c0 {
      background-color: rgb(123,133,23);
      border: 1px solid black;
      border-radius: 4px;
      color: white;
      height: 48px;
      text-align: center;
      width: 100%;
    }

    .c0[disabled] {
      cursor: not-allowed;
      opacity: 0.3;
    }

    <div>
      <button
        class="c0"
        data-testid="swatch"
        id="rgb(123, 133, 23)"
        type="button"
      >
        rgb(123, 133, 23)
      </button>
    </div>
  `);
});

test('is accessible', async () => {
  jest.useRealTimers();

  const results = await axe(container);
  expect(results).toHaveNoViolations();
  cleanup();
});
