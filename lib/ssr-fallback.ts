import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export interface SSRFallbackProps {
  __ssrFallback?: boolean;
  __error?: string;
}

type GSPFunction<P = any> = (
  context: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>>;

export function withSSRFallback<P extends Record<string, any>>(
  getServerSideProps: GSPFunction<P>
): GSPFunction<P & SSRFallbackProps> {
  return async (context: GetServerSidePropsContext) => {
    try {
      const result = await getServerSideProps(context);
      if ('props' in result) {
        return {
          ...result,
          props: {
            ...result.props,
            __ssrSuccess: true
          }
        };
      }
      return result as GetServerSidePropsResult<P & SSRFallbackProps>;
    } catch (error) {
      console.error('[SSR Fallback] Server-side rendering failed:', error);
      return {
        props: {
          __ssrFallback: true,
          __error: process.env.NODE_ENV === 'development' 
            ? (error instanceof Error ? error.message : 'Unknown error')
            : 'Server error occurred'
        } as P & SSRFallbackProps
      };
    }
  };
}

// Component wrapper for handling SSR fallback
export function withSSRErrorBoundary<P extends SSRFallbackProps>(
  Component: React.ComponentType<P>
) {
  return function SSRFallbackComponent(props: P) {
    if (props.__ssrFallback) {
      return React.createElement(
        'div',
        { className: 'ssr-fallback' },
        React.createElement(
          'div',
          { className: 'loading-skeleton' },
          process.env.NODE_ENV === 'development' && props.__error
            ? React.createElement(
                'div',
                { className: 'error-message' },
                `SSR Error: ${props.__error}`
              )
            : null,
          React.createElement('div', null, 'Loading content...')
        )
      );
    }
    return React.createElement(Component, props);
  };
}
