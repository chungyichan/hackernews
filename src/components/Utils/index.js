import React from 'react';
import classNames from 'classnames';
import Fontawesome from 'react-fontawesome';
import {Button} from '../Button';


export const Sort = ({sortKey, activeSortKey, onSort, children}) => {
  const sortClass = classNames ('button-inline', {'button-active': sortKey === activeSortKey});

  return (
    <Button
      onClick = { () => onSort(sortKey)}
      className={sortClass}
      >
      {children}
    </Button>
  );
}

export const Loading = () => {
  return (
    <div>
      <Fontawesome
        className='super-crazy-colors'
        name='rocket'
        size='2x'
        spin
        style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
        />
      Loading
    </div>
  );
};
