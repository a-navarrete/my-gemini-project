import '@testing-library/jest-dom';

// Polyfill for TextEncoder for Node.js environment
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;