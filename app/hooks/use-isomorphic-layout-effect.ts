import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect = globalThis.window ? useLayoutEffect : useEffect;
