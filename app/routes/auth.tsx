import  { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePuterStore } from '~/lib/puter'
export const meta = () => {
    [
        { title: "Resumind | Auth" },
        { name: "description", content: "log into your account to continue" },
    ]
}
const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();
    const next = location.search.split('next=')[1] || '/';

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next)
    }, [auth.isAuthenticated, next])

    return (
        <main className='bg-[url("/images/bg-main.svg")] bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center'>
            <div className='gradient-border shadow-lg'>
                <section className='flex flex-col gap-8 bg-white rounded-2xl p-10'>
                    <div className='flex flex-col items-center gap-2'>
                        <h1 className='text-2xl font-bold'>Welcome to Resumind</h1>
                        <h2 className='text-sm text-gray-500'>Log into your account to continue</h2>
                    </div>
                    {
                        isLoading ? (
                            <button className='auth-button animate-pulse'>
                                signing in...
                            </button>
                        ) : (
                            <>
                                {
                                    auth.isAuthenticated ? (
                                        <button className='auth-button' onClick={auth.signOut}>
                                            log out
                                        </button>
                                    ) : (
                                        <button className='auth-button' onClick={auth.signIn}>
                                            log in
                                        </button>
                                    )
                                }

                            </>
                        )
                    }
                </section>
            </div>

        </main>
    )
}

export default Auth
