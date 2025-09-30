import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
type GSPFunction<T = any> = (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<T>>;

export function withSSRFallback<T>(getServerSideProps: GSPFunction<T>): GSPFunction<T> {
  return async (context: GetServerSidePropsContext) => {
    try {
      return await getServerSideProps(context);
    } catch (error) {
      console.error("SSR failed, providing fallback:", error);
      return {
        props: {
          __ssrFallback: true,
          error:
            process.env.NODE_ENV === "development"
              ? (typeof error === "object" && error && "message" in error ? (error as any).message : String(error))
              : null
        } as T
      };
    }
  };
}
