import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export function withAdminAuth<T extends { [key: string]: unknown }>(
    handler?: (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<T>>
) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
        const token = ctx.req.cookies['admin_token'];

        if (!token) {
            return {
                redirect: {
                    destination: '/admin/sign-in',
                    permanent: false,
                },
            };
        }

        if (handler) {
            return handler(ctx);
        }

        return { props: {} as T };
    };
}
