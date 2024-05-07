import { useState } from 'react';
import { createContainer } from 'react-tracked';

const initialState: {
    user: any;
    notify: {
        title: string;
        text: string;
        color: string;
        opened: boolean;
    };
} = {
  user: null,
  notify: {
    title: '',
    text: '',
    color: 'teal',
    opened: true,
  },
};

const useAppState = () => useState(initialState);

export const { Provider: SharedStateProvider, useTracked: useSharedState } = createContainer(useAppState);