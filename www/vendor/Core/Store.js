'use client'

import { configureStore } from '@reduxjs/toolkit';

const AmDifferedState = (state = 0, action) => action;

const AmDiffered = configureStore(AmDifferedState);

export default AmDiffered;