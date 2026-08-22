import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

Object.defineProperty(globalThis, 'ref', { value: ref });
Object.defineProperty(globalThis, 'computed', { value: computed });
Object.defineProperty(globalThis, 'watch', { value: watch });
Object.defineProperty(globalThis, 'onMounted', { value: onMounted });
Object.defineProperty(globalThis, 'onUnmounted', { value: onUnmounted });
