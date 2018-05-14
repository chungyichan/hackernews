import React from 'react';
//import classNames from 'classnames';
//import Fontawesome from 'react-fontawesome';
import {Loading} from '../Utils';

export const Button = ({onClick, className='',children}) =>
      <button
        onClick={onClick}
        className={className}
        type="button"
        >
        {children}
      </button>

const withLoading = (Component) => ({
        isLoading, ...rest}) =>
        isLoading
        ? <Loading />
        : <Component { ...rest} />

export const ButtonWithLoading = withLoading(Button);
